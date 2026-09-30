import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@Tag("regression")
@DisplayName("Regression & Boundary Tests")
public class RegressionTest {

    @ParameterizedTest(name = "Test greeting for user: {0}")
    @ValueSource(strings = {"Alice", "Bob", "DevOps-Lead", "CI_Bot_99", "12345"})
    @DisplayName("Regression: Parameterized greeting test with varied input types")
    void testParameterizedGreetings(String username) {
        String greeting = HelloWorld.getCustomMessage(username);
        assertTrue(greeting.contains(username));
        assertTrue(greeting.endsWith("from Jenkins CI Pipeline!"));
    }

    @ParameterizedTest(name = "Total: {0}, Passed: {1} -> Expected: {2}%")
    @CsvSource({
        "100, 100, 100.0",
        "100, 50, 50.0",
        "4, 3, 75.0",
        "3, 1, 33.333333333333336"
    })
    @DisplayName("Regression: Success rate calculations for varied datasets")
    void testParameterizedSuccessRate(int total, int passed, double expected) {
        assertEquals(expected, HelloWorld.calculateSuccessRate(total, passed), 0.0001);
    }

    @Test
    @DisplayName("Boundary: Special Unicode characters handling")
    void testSpecialCharactersGreeting() {
        String specialInput = "⚡ DevSecOps 🚀";
        String result = HelloWorld.getCustomMessage(specialInput);
        assertEquals("Hello ⚡ DevSecOps 🚀 from Jenkins CI Pipeline!", result);
    }
}
