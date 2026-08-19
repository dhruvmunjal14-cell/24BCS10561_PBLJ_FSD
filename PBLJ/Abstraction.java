abstract class Bank {
    private static int balance = 5000;

    public void getBalance() {
        System.out.println(balance);
    }

    public void setBalance(int val) {
        balance = val;
    }

    public int getCurrentBalance() {
        return balance;
    }
}

class Sbi extends Bank {

    public void debit(int bal) {
        int currVal = getCurrentBalance();
        currVal -= bal;
        setBalance(currVal);
    }

    public void credit(int bal) {
        int currVal = getCurrentBalance();
        currVal += bal;
        setBalance(currVal);
    }
}

public class Abstraction {
    public static void main(String[] args) {

        Sbi sbi = new Sbi();

        sbi.getBalance();
        sbi.credit(1500);
        sbi.getBalance();
        sbi.debit(3000);
        sbi.getBalance();
    }
}