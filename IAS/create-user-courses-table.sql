-- Create user_courses table to track enrolled courses
CREATE TABLE IF NOT EXISTS user_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_progress ON user_courses(progress);

-- Enable Row Level Security
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own courses
CREATE POLICY "Users can view own courses"
    ON user_courses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own course enrollments
CREATE POLICY "Users can enroll in courses"
    ON user_courses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own course progress
CREATE POLICY "Users can update own course progress"
    ON user_courses
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own course enrollments
CREATE POLICY "Users can unenroll from courses"
    ON user_courses
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_courses_updated_at_trigger
    BEFORE UPDATE ON user_courses
    FOR EACH ROW
    EXECUTE FUNCTION update_user_courses_updated_at();

-- Create function to automatically set completed_at when progress reaches 100
CREATE OR REPLACE FUNCTION set_course_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.progress = 100 AND OLD.progress < 100 THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for completed_at
CREATE TRIGGER set_course_completed_at_trigger
    BEFORE UPDATE ON user_courses
    FOR EACH ROW
    EXECUTE FUNCTION set_course_completed_at();
