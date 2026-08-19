import java.io.Closeable;

// --- STEP 1: Create Custom Exceptions ---

// TODO: Define InsufficientFundsException (Checked Exception)
// It should accept a message in its constructor.
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String m) {
        super(m);
    }
}

// TODO: Define InvalidAmountException (Unchecked Exception)
// It should accept a message in its constructor.
class InvalidAmountException extends RuntimeException {
    public InvalidAmountException(String m) {
        super(m);
    }
}


// --- DUMMY RESOURCE FOR TRY-WITH-RESOURCES ---
class AuditLogger implements Closeable {
    public AuditLogger() {
        System.out.println("[LOG] Opening Audit Logger...");
    }

    public void logTransaction(String m) {
        System.out.println("[LOG] " + m);
    }

    @Override
    public void close() {
        System.out.println("[LOG] Closing Audit Logger resource.");
    }
}


// --- STEP 2: Implement BankAccount ---
class BankAccount {
    private String id;
    private double money;

    public BankAccount(String id, double money) {
        this.id = id;
        this.money = money;
    }

    public double getBalance() {
        return money;
    }

    public String getAccountNumber() {
        return id;
    }

    public void deposit(double n) throws InvalidAmountException {
        if (n <= 0) {
            // TODO: Throw InvalidAmountException with message "Deposit amount must be positive"
            throw new InvalidAmountException("Deposit amount must be positive");
        }

        money = money + n;
    }

    public void withdraw(double n)
            throws InsufficientFundsException, InvalidAmountException {

        if (n <= 0) {
            // TODO: Throw InvalidAmountException with message "Withdrawal amount must be positive"
            throw new InvalidAmountException("Withdrawal amount must be positive");
        }

        if (n > money) {
            // TODO: Throw InsufficientFundsException with message detailing the deficit
            double left = n - money;
            throw new InsufficientFundsException(
                    "Insufficient funds. Deficit: $" + left
            );
        }

        money = money - n;
    }

    public void transfer(BankAccount other, double n)
            throws InsufficientFundsException {

        // TODO: Use try-with-resources with AuditLogger to auto-close the resource.
        // Inside the block:
        // 1. Log the attempt
        // 2. Perform the withdrawal from 'this' account
        // 3. Perform deposit to 'targetAccount'
        // 4. Log the success

        try (AuditLogger a = new AuditLogger()) {

            a.logTransaction(
                    "Transfer of $" + n + " from " +
                    id + " to " + other.getAccountNumber()
            );

            withdraw(n);
            other.deposit(n);

            a.logTransaction("Transfer completed successfully.");

        } catch (InsufficientFundsException e) {
            // TODO: handle exception
            throw e;
        }
    }
}

// --- STEP 3: Test Driver ---
public class BankingSystem {
    public static void main(String[] args) {

        BankAccount x = new BankAccount("ACC-305", 800.0);
        BankAccount y = new BankAccount("ACC-417", 300.0);

        System.out.println("=== TEST 1: Successful Transfer ===");

        try {
            x.transfer(y, 250.0);

            System.out.println("Acc1 Balance: $" + x.getBalance());
            System.out.println("Acc2 Balance: $" + y.getBalance());

        } catch (InsufficientFundsException e) {
            System.out.println("Caught Expected Error: " + e.getMessage());
        }


        System.out.println("\n=== TEST 2: Overdraft (Checked Exception) ===");

        try {
            x.transfer(y, 1200.0);

        } catch (InsufficientFundsException e) {
            System.out.println("Caught Checked Exception: " + e.getMessage());
        }


        System.out.println("\n=== TEST 3: Negative Amount (Unchecked Exception) ===");

        try {
            x.deposit(-75.0);

        } catch (InvalidAmountException e) {
            System.out.println("Caught Unchecked Exception: " + e.getMessage());

        } finally {
            System.out.println("Cleanup / Always-executed code in main.");
        }
    }
}