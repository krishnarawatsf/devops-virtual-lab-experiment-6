import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@Tag("unit")
@DisplayName("Unit Tests - Core Functionality")
public class HelloWorldTest {

    @Test
    @DisplayName("Verify default greeting message")
    void testGetDefaultMessage() {
        String expected = "Hello from Jenkins CI Pipeline!";
        assertEquals(expected, HelloWorld.getMessage(), "Message should match default expected CI greeting.");
    }

    @Test
    @DisplayName("Verify custom greeting with valid name")
    void testGetCustomMessageValidName() {
        String result = HelloWorld.getCustomMessage("Alice");
        assertEquals("Hello Alice from Jenkins CI Pipeline!", result);
    }

    @Test
    @DisplayName("Verify custom greeting fallback on null or empty input")
    void testGetCustomMessageNullOrEmpty() {
        assertEquals("Hello from Jenkins CI Pipeline!", HelloWorld.getCustomMessage(null));
        assertEquals("Hello from Jenkins CI Pipeline!", HelloWorld.getCustomMessage("   "));
    }

    @Test
    @DisplayName("Verify success rate calculation logic")
    void testCalculateSuccessRate() {
        assertEquals(100.0, HelloWorld.calculateSuccessRate(10, 10), 0.001);
        assertEquals(50.0, HelloWorld.calculateSuccessRate(20, 10), 0.001);
        assertEquals(0.0, HelloWorld.calculateSuccessRate(0, 0), 0.001);
        
        assertThrows(IllegalArgumentException.class, () -> {
            HelloWorld.calculateSuccessRate(10, 15);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            HelloWorld.calculateSuccessRate(10, -1);
        });
    }

    @Test
    @DisplayName("Verify main method executes without throwing unhandled exceptions")
    void testMainMethodNoArgs() {
        assertDoesNotThrow(() -> HelloWorld.main(new String[]{}));
    }
}
