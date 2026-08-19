interface Drivable{
    void drive();
}

class Vehicle{
    String brand="jaguar";
    String speed="150kmph";
    public static void move(){
        System.out.println("Move");
    }
}

class Car extends Vehicle implements Drivable{
    Car(String name){
        System.out.println("This car of brand "+name);
    }
    int seats=5;

    @Override
    public void drive() {
        System.out.println("This is drive immplementation");
    }
    public static void display(){
        System.out.println("Display Method");
    }
}

public class Interface {
    public static void main(String[] args) {
        Car c=new Car("Jaguar");
        c.move();
        c.drive();
        c.display();
    }
}