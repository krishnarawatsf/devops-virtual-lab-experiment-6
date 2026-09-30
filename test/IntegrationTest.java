import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import static org.junit.jupiter.api.Assertions.*;

@Tag("integration")
@DisplayName("Integration Tests - CLI Flow & Subsystem Integration")
public class IntegrationTest {

    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;

    @BeforeEach
    void setUpStreams() {
        System.setOut(new PrintStream(outContent));
    }

    @AfterEach
    void restoreStreams() {
        System.setOut(originalOut);
    }

    @Test
    @DisplayName("CLI Integration: Test --smoke argument")
    void testCliSmokeArgument() {
        HelloWorld.main(new String[]{"--smoke"});
        String output = outContent.toString().trim();
        assertTrue(output.contains("SMOKE_TEST_OK"));
        assertTrue(output.contains("HEALTHY"));
    }

    @Test
    @DisplayName("CLI Integration: Test --version argument")
    void testCliVersionArgument() {
        HelloWorld.main(new String[]{"--version"});
        String output = outContent.toString().trim();
        assertTrue(output.contains(HelloWorld.APP_NAME));
        assertTrue(output.contains(HelloWorld.APP_VERSION));
    }

    @Test
    @DisplayName("CLI Integration: Test --greet argument with name")
    void testCliGreetArgument() {
        HelloWorld.main(new String[]{"--greet", "Jenkins"});
        String output = outContent.toString().trim();
        assertEquals("Hello Jenkins from Jenkins CI Pipeline!", output);
    }

    @Test
    @DisplayName("CLI Integration: Test --help argument")
    void testCliHelpArgument() {
        HelloWorld.main(new String[]{"--help"});
        String output = outContent.toString().trim();
        assertTrue(output.contains("Usage:"));
        assertTrue(output.contains("--smoke"));
    }

    @Test
    @DisplayName("CLI Integration: Test default execution without arguments")
    void testCliDefaultExecution() {
        HelloWorld.main(new String[]{});
        String output = outContent.toString().trim();
        assertEquals("Hello from Jenkins CI Pipeline!", output);
    }
}
