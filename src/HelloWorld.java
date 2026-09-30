public class HelloWorld {

    public static final String APP_NAME = "Jenkins Maven CI Application";
    public static final String APP_VERSION = "1.0.0";
    public static final String DEFAULT_MESSAGE = "Hello from Jenkins CI Pipeline!";

    public static void main(String[] args) {
        if (args != null && args.length > 0) {
            String command = args[0].trim();
            switch (command) {
                case "--smoke":
                case "-s":
                    System.out.println("SMOKE_TEST_OK: " + getHealthStatus());
                    break;
                case "--version":
                case "-v":
                    System.out.println(APP_NAME + " version " + APP_VERSION);
                    break;
                case "--greet":
                    String target = (args.length > 1) ? args[1] : "DevOps Engineer";
                    System.out.println(getCustomMessage(target));
                    break;
                case "--help":
                case "-h":
                    printHelp();
                    break;
                default:
                    System.out.println(getCustomMessage(command));
                    break;
            }
        } else {
            System.out.println(getMessage());
        }
    }

    public static String getMessage() {
        return DEFAULT_MESSAGE;
    }

    public static String getCustomMessage(String name) {
        if (name == null || name.trim().isEmpty()) {
            return DEFAULT_MESSAGE;
        }
        return "Hello " + name.trim() + " from Jenkins CI Pipeline!";
    }

    public static String getHealthStatus() {
        long freeMem = Runtime.getRuntime().freeMemory();
        long maxMem = Runtime.getRuntime().maxMemory();
        return "HEALTHY [FreeMemory: " + (freeMem / (1024 * 1024)) + "MB / MaxMemory: " + (maxMem / (1024 * 1024)) + "MB]";
    }

    public static boolean isHealthy() {
        return Runtime.getRuntime().availableProcessors() > 0 && Runtime.getRuntime().freeMemory() > 0;
    }

    public static double calculateSuccessRate(int totalTests, int passedTests) {
        if (totalTests <= 0) {
            return 0.0;
        }
        if (passedTests < 0 || passedTests > totalTests) {
            throw new IllegalArgumentException("Passed tests must be between 0 and totalTests");
        }
        return (double) passedTests / totalTests * 100.0;
    }

    public static String getEnvironmentInfo() {
        return "Java " + System.getProperty("java.version") + " (" + System.getProperty("os.name") + ")";
    }

    private static void printHelp() {
        System.out.println("Usage: java -jar jenkins-lab.jar [OPTIONS]");
        System.out.println("Options:");
        System.out.println("  --smoke, -s       Execute quick smoke health check");
        System.out.println("  --version, -v     Display application version");
        System.out.println("  --greet <name>    Print custom greeting message");
        System.out.println("  --help, -h        Show this help manual");
    }
}
