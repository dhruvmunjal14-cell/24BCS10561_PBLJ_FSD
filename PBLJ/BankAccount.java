class Account {
    private String accountNumber;
    private double balance;

    public Account(String accNumber, double amount) {
        accountNumber = accNumber;
        balance = amount;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double amount) {
        if (amount >= 0) {
            balance = amount;
        }
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && balance - amount >= 0) {
            balance -= amount;
            System.out.println("Balance withdrawn successfully");
        } 
        else {
            System.out.println("Not sufficient balance");
        }
    }
}

public class BankAccount {
    public static void main(String[] args) {
        Account b = new Account("392366578", 1050);

        b.deposit(150.50);
        b.withdraw(230.80);
        b.withdraw(1000.95);
        System.out.println(b.getBalance());
    }
}