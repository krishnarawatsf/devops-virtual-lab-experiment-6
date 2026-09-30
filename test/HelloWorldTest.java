import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class HelloWorldTest {

    @Test
    void testGetMessage() {
        String expected = "Hello from Jenkins CI Pipeline!";
        assertEquals(expected, HelloWorld.getMessage(), "Message should match the expected CI greeting.");
    }

    @Test
    void testMainMethod() {
        HelloWorld.main(new String[]{});
        assertNotNull(HelloWorld.getMessage());
    }
}
