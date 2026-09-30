public class HelloWorld {
    public static void main(String[] args) {
        System.out.println(getMessage());
    }

    public static String getMessage() {
        return "Hello from Jenkins CI Pipeline!";
    }
}
