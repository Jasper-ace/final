// ============================================
// ANIMATED CODE EDITOR
// ============================================

class CodeAnimation {
    constructor() {
        this.codeExamples = [
            {
                title: 'main.js',
                code: `<span class="keyword">function</span> <span class="function">learnProgramming</span>() {
  <span class="keyword">const</span> <span class="variable">skills</span> = [<span class="string">'JavaScript'</span>, <span class="string">'Python'</span>, <span class="string">'React'</span>];
  <span class="keyword">return</span> <span class="variable">skills</span>.<span class="method">map</span>(<span class="variable">skill</span> => 
    <span class="template">\`Master \${<span class="variable">skill</span>} today!\`</span>
  );
}`
            },
            {
                title: 'app.py',
                code: `<span class="keyword">def</span> <span class="function">build_career</span>():
    <span class="variable">languages</span> = [<span class="string">'Python'</span>, <span class="string">'Django'</span>, <span class="string">'FastAPI'</span>]
    <span class="keyword">for</span> <span class="variable">lang</span> <span class="keyword">in</span> <span class="variable">languages</span>:
        <span class="function">print</span>(<span class="template">f"Learning {<span class="variable">lang</span>}..."</span>)
    <span class="keyword">return</span> <span class="string">"Success!"</span>`
            },
            {
                title: 'App.jsx',
                code: `<span class="keyword">const</span> <span class="function">App</span> = () => {
  <span class="keyword">const</span> [<span class="variable">skills</span>, <span class="variable">setSkills</span>] = <span class="function">useState</span>([]);
  
  <span class="keyword">return</span> (
    <span class="tag">&lt;div</span> <span class="attribute">className</span>=<span class="string">"app"</span><span class="tag">&gt;</span>
      <span class="tag">&lt;h1&gt;</span>Master React Today!<span class="tag">&lt;/h1&gt;</span>
    <span class="tag">&lt;/div&gt;</span>
  );
};`
            },
            {
                title: 'server.js',
                code: `<span class="keyword">const</span> <span class="variable">express</span> = <span class="function">require</span>(<span class="string">'express'</span>);
<span class="keyword">const</span> <span class="variable">app</span> = <span class="function">express</span>();

<span class="variable">app</span>.<span class="method">get</span>(<span class="string">'/api/courses'</span>, (<span class="variable">req</span>, <span class="variable">res</span>) => {
  <span class="variable">res</span>.<span class="method">json</span>({ <span class="property">message</span>: <span class="string">'Learn Backend!'</span> });
});

<span class="variable">app</span>.<span class="method">listen</span>(<span class="number">3000</span>);`
            },
            {
                title: 'styles.css',
                code: `<span class="selector">.hero</span> {
  <span class="property">background</span>: <span class="function">linear-gradient</span>(
    <span class="number">135deg</span>, 
    <span class="value">#667eea</span>, 
    <span class="value">#764ba2</span>
  );
  <span class="property">animation</span>: <span class="value">fadeIn</span> <span class="number">1s</span> <span class="value">ease</span>;
}`
            }
        ];
        
        this.currentIndex = 0;
        this.isTyping = false;
        this.init();
    }
    
    init() {
        this.codeContent = document.querySelector('.code-content pre code');
        this.windowTitle = document.querySelector('.window-title');
        
        if (!this.codeContent || !this.windowTitle) return;
        
        // Start the animation cycle
        this.startCycle();
    }
    
    async startCycle() {
        while (true) {
            await this.typeCode(this.codeExamples[this.currentIndex]);
            await this.wait(3000); // Wait 3 seconds before next code
            await this.eraseCode();
            await this.wait(500); // Brief pause before next code
            
            this.currentIndex = (this.currentIndex + 1) % this.codeExamples.length;
        }
    }
    
    async typeCode(example) {
        this.isTyping = true;
        
        // Update title with typing effect
        this.windowTitle.textContent = '';
        for (let char of example.title) {
            this.windowTitle.textContent += char;
            await this.wait(50);
        }
        
        // Type code line by line
        const lines = example.code.split('\n');
        this.codeContent.innerHTML = '';
        
        for (let line of lines) {
            const lineDiv = document.createElement('div');
            this.codeContent.appendChild(lineDiv);
            
            // Type each character
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = line;
            const text = tempDiv.textContent;
            
            for (let i = 0; i <= line.length; i++) {
                const partial = line.substring(0, i);
                lineDiv.innerHTML = partial + '<span class="cursor">|</span>';
                await this.wait(20);
            }
            
            lineDiv.innerHTML = line;
            await this.wait(100);
        }
        
        this.isTyping = false;
    }
    
    async eraseCode() {
        const lines = this.codeContent.querySelectorAll('div');
        
        // Erase from bottom to top
        for (let i = lines.length - 1; i >= 0; i--) {
            lines[i].style.opacity = '0';
            lines[i].style.transform = 'translateX(-20px)';
            lines[i].style.transition = 'all 0.2s ease';
            await this.wait(50);
        }
        
        this.codeContent.innerHTML = '';
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new CodeAnimation();
});
