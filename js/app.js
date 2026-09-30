// Virtual Lab Experiment 6: Jenkins with Maven CI/CD Intelligence Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

const TEST_DATA = [
    // Smoke Tests
    { id: 'SMK-01', class: 'SmokeTest', name: 'testApplicationClassPresence', type: 'smoke', duration: '2ms', status: 'PASSED', desc: 'Validates class presence, semver version format, and default message constants' },
    { id: 'SMK-02', class: 'SmokeTest', name: 'testRuntimeHealthCheck', type: 'smoke', duration: '4ms', status: 'PASSED', desc: 'Validates JVM memory allocation and available processors health status' },
    { id: 'SMK-03', class: 'SmokeTest', name: 'testCoreResponseExecutionSpeed', type: 'smoke', duration: '1ms', status: 'PASSED', desc: 'Validates latency boundary (<50ms execution limit)' },
    { id: 'SMK-04', class: 'SmokeTest', name: 'testEnvironmentInfo', type: 'smoke', duration: '1ms', status: 'PASSED', desc: 'Validates runtime OS and Java version metadata retrieval' },

    // Unit Tests
    { id: 'UNT-01', class: 'HelloWorldTest', name: 'testGetDefaultMessage', type: 'unit', duration: '1ms', status: 'PASSED', desc: 'Verifies default CI greeting string matches exact experiment requirement' },
    { id: 'UNT-02', class: 'HelloWorldTest', name: 'testGetCustomMessageValidName', type: 'unit', duration: '1ms', status: 'PASSED', desc: 'Verifies personalized greeting format for custom name inputs' },
    { id: 'UNT-03', class: 'HelloWorldTest', name: 'testGetCustomMessageNullOrEmpty', type: 'unit', duration: '1ms', status: 'PASSED', desc: 'Verifies fallback to default message upon null or blank names' },
    { id: 'UNT-04', class: 'HelloWorldTest', name: 'testCalculateSuccessRate', type: 'unit', duration: '2ms', status: 'PASSED', desc: 'Verifies percentage calculation and bounds checking with exception handling' },
    { id: 'UNT-05', class: 'HelloWorldTest', name: 'testMainMethodNoArgs', type: 'unit', duration: '2ms', status: 'PASSED', desc: 'Verifies entry point executes cleanly without exceptions' },

    // Integration Tests
    { id: 'INT-01', class: 'IntegrationTest', name: 'testCliSmokeArgument', type: 'integration', duration: '2ms', status: 'PASSED', desc: 'CLI stream interception for --smoke argument validation' },
    { id: 'INT-02', class: 'IntegrationTest', name: 'testCliVersionArgument', type: 'integration', duration: '1ms', status: 'PASSED', desc: 'CLI stream interception for --version argument validation' },
    { id: 'INT-03', class: 'IntegrationTest', name: 'testCliGreetArgument', type: 'integration', duration: '1ms', status: 'PASSED', desc: 'CLI stream interception for --greet parameter validation' },
    { id: 'INT-04', class: 'IntegrationTest', name: 'testCliHelpArgument', type: 'integration', duration: '1ms', status: 'PASSED', desc: 'CLI stream interception for --help usage manual output' },
    { id: 'INT-05', class: 'IntegrationTest', name: 'testCliDefaultExecution', type: 'integration', duration: '1ms', status: 'PASSED', desc: 'CLI stream interception for default argumentless invocation' },

    // Regression & Boundary Tests
    { id: 'REG-01', class: 'RegressionTest', name: 'testParameterizedGreetings [Alice]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Parameterized boundary test for standard name' },
    { id: 'REG-02', class: 'RegressionTest', name: 'testParameterizedGreetings [Bob]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Parameterized boundary test for short name' },
    { id: 'REG-03', class: 'RegressionTest', name: 'testParameterizedGreetings [DevOps-Lead]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Parameterized boundary test with hyphenation' },
    { id: 'REG-04', class: 'RegressionTest', name: 'testParameterizedGreetings [CI_Bot_99]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Parameterized boundary test with underscores and numbers' },
    { id: 'REG-05', class: 'RegressionTest', name: 'testParameterizedGreetings [12345]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Parameterized boundary test with numeric-only string' },
    { id: 'REG-06', class: 'RegressionTest', name: 'testParameterizedSuccessRate [100/100]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Boundary calculation: 100% test success rate' },
    { id: 'REG-07', class: 'RegressionTest', name: 'testParameterizedSuccessRate [50/100]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Boundary calculation: 50% test success rate' },
    { id: 'REG-08', class: 'RegressionTest', name: 'testParameterizedSuccessRate [3/4]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Boundary calculation: 75% test success rate' },
    { id: 'REG-09', class: 'RegressionTest', name: 'testParameterizedSuccessRate [1/3]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Boundary calculation: 33.33% recurring float precision' },
    { id: 'REG-10', class: 'RegressionTest', name: 'testSpecialCharactersGreeting [Unicode ⚡🚀]', type: 'regression', duration: '1ms', status: 'PASSED', desc: 'Boundary test for UTF-8 emoji and symbols' }
];

const STAGE_LOGS = {
    checkout: [
        '<span class="log-purple">[STAGE 1/8: SCM CHECKOUT]</span>',
        '<span class="log-info">[INFO] Fetching latest commit from GitHub repository...</span>',
        '<span class="log-cyan">> git fetch --tags --force --progress -- https://github.com/krishnarawatsf/devops-virtual-lab-experiment-6.git +refs/heads/*:refs/remotes/origin/*</span>',
        '<span class="log-cyan">> git checkout -f main</span>',
        '<span class="log-success">[SUCCESS] Commit bae19f4 checked out successfully into /workspace/jenkins-lab</span>'
    ],
    compile: [
        '<span class="log-purple">[STAGE 2/8: MAVEN COMPILE]</span>',
        '<span class="log-info">[INFO] Executing goal: mvn compile</span>',
        '<span class="log-dim">[INFO] --- compiler:3.13.0:compile (default-compile) @ jenkins-lab ---</span>',
        '<span class="log-info">[INFO] Compiling 1 source file with javac [debug release 11] to target/classes</span>',
        '<span class="log-success">[SUCCESS] Bytecode compilation completed in 0.28s</span>'
    ],
    smoke: [
        '<span class="log-purple">[STAGE 3/8: SMOKE TESTING]</span>',
        '<span class="log-cyan">[INFO] Executing Smoke Tests: mvn test -Dtest=SmokeTest</span>',
        '<span class="log-info">[INFO] Running SmokeTest</span>',
        '<span class="log-success">✓ Smoke 01: Application class presence [PASSED: 2ms]</span>',
        '<span class="log-success">✓ Smoke 02: JVM environment & memory health [PASSED: 4ms]</span>',
        '<span class="log-success">✓ Smoke 03: Latency boundary (<50ms) [PASSED: 1ms]</span>',
        '<span class="log-success">✓ Smoke 04: Environment metadata [PASSED: 1ms]</span>',
        '<span class="log-success">[SUCCESS] 4/4 Smoke Tests Passed (0 Failures, 0 Errors) in 0.025s</span>'
    ],
    unit: [
        '<span class="log-purple">[STAGE 4/8: UNIT TESTING]</span>',
        '<span class="log-cyan">[INFO] Executing Unit Tests: mvn test -Dtest=HelloWorldTest</span>',
        '<span class="log-info">[INFO] Running HelloWorldTest</span>',
        '<span class="log-success">✓ UNT-01: testGetDefaultMessage [PASSED: 1ms]</span>',
        '<span class="log-success">✓ UNT-02: testGetCustomMessageValidName [PASSED: 1ms]</span>',
        '<span class="log-success">✓ UNT-03: testGetCustomMessageNullOrEmpty [PASSED: 1ms]</span>',
        '<span class="log-success">✓ UNT-04: testCalculateSuccessRate [PASSED: 2ms]</span>',
        '<span class="log-success">✓ UNT-05: testMainMethodNoArgs [PASSED: 2ms]</span>',
        '<span class="log-success">[SUCCESS] 5/5 Unit Tests Passed in 0.004s</span>'
    ],
    int: [
        '<span class="log-purple">[STAGE 5/8: INTEGRATION & CLI STREAM TESTING]</span>',
        '<span class="log-cyan">[INFO] Executing Integration Tests: mvn test -Dtest=IntegrationTest</span>',
        '<span class="log-info">[INFO] Running IntegrationTest</span>',
        '<span class="log-success">✓ INT-01: CLI --smoke argument stream capture [PASSED]</span>',
        '<span class="log-success">✓ INT-02: CLI --version argument stream capture [PASSED]</span>',
        '<span class="log-success">✓ INT-03: CLI --greet argument stream capture [PASSED]</span>',
        '<span class="log-success">✓ INT-04: CLI --help manual stream capture [PASSED]</span>',
        '<span class="log-success">✓ INT-05: CLI default invocation stream capture [PASSED]</span>',
        '<span class="log-success">[SUCCESS] 5/5 Integration Tests Passed in 0.005s</span>'
    ],
    reg: [
        '<span class="log-purple">[STAGE 6/8: PARAMETERIZED REGRESSION TESTING]</span>',
        '<span class="log-cyan">[INFO] Executing Regression Tests: mvn test -Dtest=RegressionTest</span>',
        '<span class="log-info">[INFO] Running RegressionTest</span>',
        '<span class="log-success">✓ REG-01 to 05: 5 Parameterized Name Variations [ALL PASSED]</span>',
        '<span class="log-success">✓ REG-06 to 09: 4 Parameterized Success Rate Computations [ALL PASSED]</span>',
        '<span class="log-success">✓ REG-10: Special UTF-8 Emoji & Symbols Greeting [PASSED]</span>',
        '<span class="log-success">[SUCCESS] 10/10 Regression Tests Passed in 0.035s</span>'
    ],
    package: [
        '<span class="log-purple">[STAGE 7/8: PACKAGE JAR & ARCHIVE]</span>',
        '<span class="log-info">[INFO] Executing goal: mvn clean package</span>',
        '<span class="log-dim">[INFO] --- jar:3.4.1:jar (default-jar) @ jenkins-lab ---</span>',
        '<span class="log-info">[INFO] Building jar: target/jenkins-lab-1.0-SNAPSHOT.jar</span>',
        '<span class="log-success">[SUCCESS] Artifact packaged: target/jenkins-lab-1.0-SNAPSHOT.jar (3.6 KB)</span>'
    ],
    verify: [
        '<span class="log-purple">[STAGE 8/8: RUNTIME EXECUTION VERIFICATION]</span>',
        '<span class="log-cyan">> java -jar target/jenkins-lab-1.0-SNAPSHOT.jar</span>',
        '<span class="log-info">Hello from Jenkins CI Pipeline!</span>',
        '<span class="log-cyan">> java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --smoke</span>',
        '<span class="log-success">SMOKE_TEST_OK: HEALTHY [FreeMemory: 255MB / MaxMemory: 4096MB]</span>',
        '<span class="log-success">[SUCCESS] Runtime verification passed. CI Build Finished with 100% SUCCESS.</span>'
    ]
};

const LOGS = {
    full: [
        '<span class="log-cyan">[INFO] Scanning for projects...</span>',
        '<span class="log-dim">-----------------------< com.devops:jenkins-lab >-----------------------</span>',
        '<span class="log-info">[INFO] Building jenkins-lab 1.0-SNAPSHOT</span>',
        '<span class="log-dim">[INFO] from pom.xml</span>',
        '<span class="log-dim">--------------------------------[ jar ]---------------------------------</span>',
        '<span class="log-info">[INFO] --- clean:3.2.0:clean (default-clean) @ jenkins-lab ---</span>',
        '<span class="log-dim">[INFO] Deleting /workspace/target</span>',
        '<span class="log-info">[INFO] --- compiler:3.13.0:compile (default-compile) @ jenkins-lab ---</span>',
        '<span class="log-info">[INFO] Compiling 1 source file with javac [debug release 11] to target/classes</span>',
        '<span class="log-info">[INFO] --- compiler:3.13.0:testCompile (default-testCompile) @ jenkins-lab ---</span>',
        '<span class="log-info">[INFO] Compiling 4 source files with javac [debug release 11] to target/test-classes</span>',
        '<span class="log-info">[INFO] --- surefire:3.2.5:test (default-test) @ jenkins-lab ---</span>',
        '<span class="log-dim">[INFO] Running SmokeTest</span>',
        '<span class="log-success">[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.025 s</span>',
        '<span class="log-dim">[INFO] Running RegressionTest</span>',
        '<span class="log-success">[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.035 s</span>',
        '<span class="log-dim">[INFO] Running HelloWorldTest</span>',
        '<span class="log-cyan">Hello from Jenkins CI Pipeline!</span>',
        '<span class="log-success">[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.004 s</span>',
        '<span class="log-dim">[INFO] Running IntegrationTest</span>',
        '<span class="log-success">[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 s</span>',
        '<span class="log-dim">-------------------------------------------------------</span>',
        '<span class="log-success">[INFO] Results: Tests run: 24, Failures: 0, Errors: 0, Skipped: 0</span>',
        '<span class="log-info">[INFO] --- jar:3.4.1:jar (default-jar) @ jenkins-lab ---</span>',
        '<span class="log-info">[INFO] Building jar: target/jenkins-lab-1.0-SNAPSHOT.jar</span>',
        '<span class="log-dim">------------------------------------------------------------------------</span>',
        '<span class="log-success">[INFO] BUILD SUCCESS</span>',
        '<span class="log-dim">[INFO] Total time: 1.173 s</span>',
        '<span class="log-dim">[INFO] Finished at: 2026-09-30T22:13:26+05:30</span>',
        '<span class="log-dim">------------------------------------------------------------------------</span>'
    ],
    smoke: [
        '<span class="log-cyan">[INFO] Executing Smoke Tests specifically via Surefire: SmokeTest.java</span>',
        '<span class="log-dim">-------------------------------------------------------</span>',
        '<span class="log-dim"> T E S T S</span>',
        '<span class="log-dim">-------------------------------------------------------</span>',
        '<span class="log-info">[INFO] Running SmokeTest</span>',
        '<span class="log-success">✓ Smoke 01: Application class loads and constants are non-null [PASSED]</span>',
        '<span class="log-success">✓ Smoke 02: JVM environment and runtime health check [PASSED]</span>',
        '<span class="log-success">✓ Smoke 03: Fast execution response time (Latency < 50ms) [PASSED: 1ms]</span>',
        '<span class="log-success">✓ Smoke 04: Environment metadata availability [PASSED]</span>',
        '<span class="log-success">[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0</span>',
        '<span class="log-success">[INFO] BUILD SUCCESS (Smoke Validation Passed in 0.025s)</span>'
    ],
    surefire: [
        '<span class="log-dim">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span>',
        '<span class="log-info">&lt;testsuite name="com.devops.TestSuite" tests="24" failures="0" errors="0" skipped="0" time="0.069"&gt;</span>',
        '<span class="log-cyan">  &lt;testcase name="SmokeTest.testApplicationClassPresence" time="0.002"/&gt;</span>',
        '<span class="log-cyan">  &lt;testcase name="SmokeTest.testRuntimeHealthCheck" time="0.004"/&gt;</span>',
        '<span class="log-cyan">  &lt;testcase name="SmokeTest.testCoreResponseExecutionSpeed" time="0.001"/&gt;</span>',
        '<span class="log-cyan">  &lt;testcase name="HelloWorldTest.testGetDefaultMessage" time="0.001"/&gt;</span>',
        '<span class="log-cyan">  &lt;testcase name="IntegrationTest.testCliSmokeArgument" time="0.002"/&gt;</span>',
        '<span class="log-cyan">  &lt;testcase name="RegressionTest.testParameterizedGreetings" time="0.005"/&gt;</span>',
        '<span class="log-info">&lt;/testsuite&gt;</span>',
        '<span class="log-success">[Jenkins JUnit Plugin] Recorded test results: 24 tests passed across 4 classes.</span>'
    ],
    runtime: [
        '<span class="log-purple">$ java -jar target/jenkins-lab-1.0-SNAPSHOT.jar</span>',
        '<span class="log-cyan">Hello from Jenkins CI Pipeline!</span>',
        '<span class="log-purple">$ java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --smoke</span>',
        '<span class="log-success">SMOKE_TEST_OK: HEALTHY [FreeMemory: 255MB / MaxMemory: 4096MB]</span>',
        '<span class="log-purple">$ java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --version</span>',
        '<span class="log-info">Jenkins Maven CI Application version 1.0.0</span>',
        '<span class="log-purple">$ java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --greet "DevOps Pipeline"</span>',
        '<span class="log-cyan">Hello DevOps Pipeline from Jenkins CI Pipeline!</span>'
    ]
};

let isPipelineRunning = false;

function initDashboard() {
    renderTestList(TEST_DATA);
    renderTerminalLogs('full');
    setupEventListeners();
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
}

function updateLiveClock() {
    const now = new Date();
    const timeEl = document.getElementById('live-time');
    if (timeEl) {
        timeEl.textContent = now.toTimeString().split(' ')[0] + ' UTC';
    }
}

function renderTestList(tests) {
    const container = document.getElementById('test-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (tests.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 24px; color: var(--text-dim);">No tests found matching filter criteria.</div>';
        return;
    }
    
    tests.forEach(t => {
        const item = document.createElement('div');
        item.className = 'test-card-item';
        item.setAttribute('title', 'Click to run this test in terminal');
        
        let badgeClass = 'type-unit';
        if (t.type === 'smoke') badgeClass = 'type-smoke';
        else if (t.type === 'integration') badgeClass = 'type-int';
        else if (t.type === 'regression') badgeClass = 'type-reg';
        
        item.innerHTML = `
            <div class="test-info-left">
                <i class="fa-solid fa-circle-check test-icon-pass"></i>
                <div>
                    <div class="test-name-text">${t.name}</div>
                    <div class="test-class-tag">${t.class} &bull; <span style="color:var(--text-dim)">${t.desc}</span></div>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <span class="test-badge-type ${badgeClass}">${t.type}</span>
                <span class="test-duration">${t.duration}</span>
            </div>
        `;

        item.addEventListener('click', () => {
            executeTerminalCommand(`mvn test -Dtest=${t.class}#${t.name.split(' ')[0]}`);
        });

        container.appendChild(item);
    });
}

function renderTerminalLogs(tabKey) {
    const body = document.getElementById('terminal-content');
    if (!body) return;
    
    const lines = LOGS[tabKey] || LOGS.full;
    body.innerHTML = lines.map(l => `<div class="log-line">${l}</div>`).join('');
    body.scrollTop = body.scrollHeight;
}

function setupEventListeners() {
    // Tab switching in terminal
    document.querySelectorAll('.term-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.term-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const tabKey = e.target.getAttribute('data-tab');
            renderTerminalLogs(tabKey);
        });
    });

    // Pipeline Stage Click to view stage logs
    document.querySelectorAll('.pipeline-stage').forEach(stageEl => {
        stageEl.addEventListener('click', () => {
            const stageKey = stageEl.getAttribute('data-stage');
            document.querySelectorAll('.pipeline-stage').forEach(s => s.classList.remove('active'));
            stageEl.classList.add('active');
            
            if (STAGE_LOGS[stageKey]) {
                const term = document.getElementById('terminal-content');
                if (term) {
                    term.innerHTML = STAGE_LOGS[stageKey].map(l => `<div class="log-line">${l}</div>`).join('');
                    term.scrollTop = term.scrollHeight;
                }
            }
        });
    });

    // Test filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filterType = e.target.getAttribute('data-filter');
            
            if (filterType === 'all') {
                renderTestList(TEST_DATA);
            } else {
                const filtered = TEST_DATA.filter(t => t.type === filterType);
                renderTestList(filtered);
            }
        });
    });

    // Test Search
    const searchInput = document.getElementById('test-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            const filtered = TEST_DATA.filter(t => 
                t.name.toLowerCase().includes(q) || 
                t.class.toLowerCase().includes(q) || 
                t.desc.toLowerCase().includes(q)
            );
            renderTestList(filtered);
        });
    }

    // Terminal command input runner
    const cmdInput = document.getElementById('term-cmd-input');
    if (cmdInput) {
        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = cmdInput.value.trim();
                if (cmd) {
                    executeTerminalCommand(cmd);
                    cmdInput.value = '';
                }
            }
        });
    }

    // Trigger Pipeline Button
    const triggerBtn = document.getElementById('btn-trigger-pipeline');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            runLivePipelineSimulation();
        });
    }

    // Quick Command Pills
    document.querySelectorAll('.cmd-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            executeTerminalCommand(cmd);
        });
    });

    // Terminal dots: Red = Clear, Yellow = Reset, Green = Run All
    const dotRed = document.querySelector('.term-dot.red');
    if (dotRed) {
        dotRed.addEventListener('click', () => {
            const term = document.getElementById('terminal-content');
            if (term) term.innerHTML = '<div class="log-line log-dim">[Terminal cleared. Ready for commands.]</div>';
        });
    }
    const dotYellow = document.querySelector('.term-dot.yellow');
    if (dotYellow) {
        dotYellow.addEventListener('click', () => {
            renderTerminalLogs('full');
        });
    }
    const dotGreen = document.querySelector('.term-dot.green');
    if (dotGreen) {
        dotGreen.addEventListener('click', () => {
            runLivePipelineSimulation();
        });
    }

    // Viva Voce Flashcards click to toggle
    document.querySelectorAll('.viva-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('collapsed');
            const hint = card.querySelector('.viva-toggle-hint span');
            if (hint) {
                hint.textContent = card.classList.contains('collapsed') ? 'Click to reveal answer' : 'Click to hide answer';
            }
        });
    });
}

function executeTerminalCommand(cmd) {
    const term = document.getElementById('terminal-content');
    if (!term) return;

    term.innerHTML += `<div class="log-line" style="margin-top:8px;"><span class="log-purple">$ ${cmd}</span></div>`;
    
    const cleanCmd = cmd.toLowerCase().trim();
    
    if (cleanCmd.includes('smoketest') || (cleanCmd.includes('smoke') && !cleanCmd.includes('--smoke'))) {
        term.innerHTML += `
            <div class="log-line log-cyan">[INFO] Executing Smoke Tests specifically via Surefire: SmokeTest.java</div>
            <div class="log-line log-dim">-------------------------------------------------------</div>
            <div class="log-line log-info">[INFO] Running SmokeTest</div>
            <div class="log-line log-success">✓ Smoke 01: Application class loads and constants are non-null [PASSED: 2ms]</div>
            <div class="log-line log-success">✓ Smoke 02: JVM environment and runtime health check [PASSED: 4ms]</div>
            <div class="log-line log-success">✓ Smoke 03: Latency boundary (&lt;50ms) [PASSED: 1ms]</div>
            <div class="log-line log-success">✓ Smoke 04: Environment metadata availability [PASSED: 1ms]</div>
            <div class="log-line log-success">[INFO] Tests run: 4, Failures: 0, Errors: 0, Time elapsed: 0.025s</div>
            <div class="log-line log-success">[INFO] BUILD SUCCESS (Smoke Validation Passed)</div>
        `;
    } else if (cleanCmd.includes('helloworldtest')) {
        term.innerHTML += `
            <div class="log-line log-cyan">[INFO] Running Unit Tests: HelloWorldTest.java</div>
            <div class="log-line log-info">[INFO] Running HelloWorldTest</div>
            <div class="log-line log-success">✓ UNT-01: testGetDefaultMessage [PASSED: 1ms]</div>
            <div class="log-line log-success">✓ UNT-02: testGetCustomMessageValidName [PASSED: 1ms]</div>
            <div class="log-line log-success">✓ UNT-03: testGetCustomMessageNullOrEmpty [PASSED: 1ms]</div>
            <div class="log-line log-success">✓ UNT-04: testCalculateSuccessRate [PASSED: 2ms]</div>
            <div class="log-line log-success">✓ UNT-05: testMainMethodNoArgs [PASSED: 2ms]</div>
            <div class="log-line log-success">[INFO] Tests run: 5, Failures: 0, Errors: 0, Time elapsed: 0.004s</div>
            <div class="log-line log-success">[INFO] BUILD SUCCESS</div>
        `;
    } else if (cleanCmd.includes('integrationtest')) {
        term.innerHTML += `
            <div class="log-line log-cyan">[INFO] Running Integration Tests: IntegrationTest.java</div>
            <div class="log-line log-info">[INFO] Running IntegrationTest</div>
            <div class="log-line log-success">✓ INT-01: CLI --smoke argument stream capture [PASSED]</div>
            <div class="log-line log-success">✓ INT-02: CLI --version argument stream capture [PASSED]</div>
            <div class="log-line log-success">✓ INT-03: CLI --greet argument stream capture [PASSED]</div>
            <div class="log-line log-success">✓ INT-04: CLI --help manual stream capture [PASSED]</div>
            <div class="log-line log-success">✓ INT-05: CLI default invocation stream capture [PASSED]</div>
            <div class="log-line log-success">[INFO] Tests run: 5, Failures: 0, Errors: 0, Time elapsed: 0.005s</div>
            <div class="log-line log-success">[INFO] BUILD SUCCESS</div>
        `;
    } else if (cleanCmd.includes('regressiontest')) {
        term.innerHTML += `
            <div class="log-line log-cyan">[INFO] Running Regression Tests: RegressionTest.java</div>
            <div class="log-line log-info">[INFO] Running RegressionTest</div>
            <div class="log-line log-success">✓ REG-01 to 05: 5 Parameterized Name Variations [ALL PASSED]</div>
            <div class="log-line log-success">✓ REG-06 to 09: 4 Parameterized Success Rate Computations [ALL PASSED]</div>
            <div class="log-line log-success">✓ REG-10: Special UTF-8 Emoji & Symbols Greeting [PASSED]</div>
            <div class="log-line log-success">[INFO] Tests run: 10, Failures: 0, Errors: 0, Time elapsed: 0.035s</div>
            <div class="log-line log-success">[INFO] BUILD SUCCESS</div>
        `;
    } else if (cleanCmd === 'mvn test' || cleanCmd === 'mvn clean test') {
        term.innerHTML += `
            <div class="log-line log-cyan">[INFO] Running Full Test Suite (Surefire JUnit Platform)...</div>
            <div class="log-line log-dim">Running SmokeTest (4 tests) - PASSED in 0.025s</div>
            <div class="log-line log-dim">Running HelloWorldTest (5 tests) - PASSED in 0.004s</div>
            <div class="log-line log-dim">Running IntegrationTest (5 tests) - PASSED in 0.005s</div>
            <div class="log-line log-dim">Running RegressionTest (10 tests) - PASSED in 0.035s</div>
            <div class="log-line log-success">[INFO] Results: Tests run: 24, Failures: 0, Errors: 0, Skipped: 0</div>
            <div class="log-line log-success">[INFO] BUILD SUCCESS (Total time: 0.783s)</div>
        `;
    } else if (cleanCmd.includes('--smoke') || cleanCmd.includes('-s')) {
        term.innerHTML += `<div class="log-line log-success">SMOKE_TEST_OK: HEALTHY [FreeMemory: 255MB / MaxMemory: 4096MB]</div>`;
    } else if (cleanCmd.includes('--greet')) {
        const parts = cmd.split('--greet');
        const name = parts[1] ? parts[1].replace(/["']/g, '').trim() : 'Developer';
        term.innerHTML += `<div class="log-line log-cyan">Hello ${name} from Jenkins CI Pipeline!</div>`;
    } else if (cleanCmd.includes('--version') || cleanCmd.includes('-v')) {
        term.innerHTML += `<div class="log-line log-info">Jenkins Maven CI Application version 1.0.0</div>`;
    } else if (cleanCmd.includes('package') || cleanCmd.includes('clean')) {
        term.innerHTML += `
            <div class="log-line log-info">[INFO] Packaging application into executable JAR...</div>
            <div class="log-line log-dim">[INFO] Building jar: target/jenkins-lab-1.0-SNAPSHOT.jar</div>
            <div class="log-line log-success">[INFO] BUILD SUCCESS (JAR archived successfully)</div>
        `;
    } else if (cleanCmd.includes('help') || cleanCmd.includes('-h')) {
        term.innerHTML += `
            <div class="log-line log-dim">Usage: java -jar jenkins-lab.jar [OPTIONS]</div>
            <div class="log-line log-dim">  --smoke, -s       Execute quick smoke health check</div>
            <div class="log-line log-dim">  --version, -v     Display application version</div>
            <div class="log-line log-dim">  --greet &lt;name&gt;    Print custom greeting message</div>
            <div class="log-line log-dim">  --help, -h        Show help manual</div>
        `;
    } else {
        term.innerHTML += `<div class="log-line log-cyan">Hello from Jenkins CI Pipeline!</div>`;
    }

    term.scrollTop = term.scrollHeight;
}

function runLivePipelineSimulation() {
    if (isPipelineRunning) return;
    isPipelineRunning = true;

    const stages = document.querySelectorAll('.pipeline-stage');
    const triggerBtn = document.getElementById('btn-trigger-pipeline');
    if (triggerBtn) {
        triggerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running Build...';
        triggerBtn.disabled = true;
    }

    // Reset stages
    stages.forEach(s => {
        s.classList.remove('running', 'success', 'active');
        s.querySelector('.stage-status-icon').innerHTML = '<i class="fa-solid fa-clock"></i>';
    });

    let currentStageIndex = 0;
    
    const stageKeys = ['checkout', 'compile', 'smoke', 'unit', 'int', 'reg', 'package', 'verify'];
    const stageNames = [
        "1/8: SCM Checkout",
        "2/8: Maven Compile",
        "3/8: Smoke Testing",
        "4/8: Unit Testing",
        "5/8: Integration Testing",
        "6/8: Regression Testing",
        "7/8: Package JAR",
        "8/8: Runtime Verify"
    ];

    function advanceStage() {
        if (currentStageIndex > 0) {
            const prev = stages[currentStageIndex - 1];
            prev.classList.remove('running');
            prev.classList.add('success');
            prev.querySelector('.stage-status-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
        }

        if (currentStageIndex < stages.length) {
            const current = stages[currentStageIndex];
            current.classList.add('running', 'active');
            current.querySelector('.stage-status-icon').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            
            const key = stageKeys[currentStageIndex];
            if (STAGE_LOGS[key]) {
                const term = document.getElementById('terminal-content');
                if (term) {
                    STAGE_LOGS[key].forEach(log => {
                        term.innerHTML += `<div class="log-line">${log}</div>`;
                    });
                    term.scrollTop = term.scrollHeight;
                }
            }

            currentStageIndex++;
            setTimeout(advanceStage, 550);
        } else {
            isPipelineRunning = false;
            if (triggerBtn) {
                triggerBtn.innerHTML = '<i class="fa-solid fa-play"></i> Trigger Pipeline';
                triggerBtn.disabled = false;
            }
            executeTerminalCommand('PIPELINE_COMPLETE: BUILD SUCCESS (All 24 Tests Passed)');
        }
    }

    advanceStage();
}
