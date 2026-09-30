import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@Tag("smoke")
@DisplayName("Smoke Tests - Critical Path & Runtime Health Verification")
public class SmokeTest {

    @Test
    @DisplayName("Smoke 01: Application class loads and constants are non-null")
    void testApplicationClassPresence() {
        assertNotNull(HelloWorld.APP_NAME, "App name must be defined");
        assertNotNull(HelloWorld.APP_VERSION, "App version must be defined");
        assertNotNull(HelloWorld.DEFAULT_MESSAGE, "Default message must be defined");
        assertTrue(HelloWorld.APP_VERSION.matches("\\d+\\.\\d+\\.\\d+"), "Version should follow semver");
    }

    @Test
    @DisplayName("Smoke 02: JVM environment and runtime health check")
    void testRuntimeHealthCheck() {
        assertTrue(HelloWorld.isHealthy(), "Runtime health check should return true");
        String healthStatus = HelloWorld.getHealthStatus();
        assertNotNull(healthStatus);
        assertTrue(healthStatus.startsWith("HEALTHY"), "Health status string should begin with HEALTHY");
    }

    @Test
    @DisplayName("Smoke 03: Fast execution response time (Latency < 50ms)")
    void testCoreResponseExecutionSpeed() {
        assertTimeoutPreemptively(Duration.ofMillis(50), () -> {
            String msg = HelloWorld.getMessage();
            assertNotNull(msg);
            assertEquals("Hello from Jenkins CI Pipeline!", msg);
        }, "Smoke execution must complete within 50 milliseconds");
    }

    @Test
    @DisplayName("Smoke 04: Environment metadata availability")
    void testEnvironmentInfo() {
        String env = HelloWorld.getEnvironmentInfo();
        assertNotNull(env);
        assertTrue(env.contains("Java"), "Environment info must include Java runtime version");
    }
}
