import java.util.*;
class InventoryReorderingSystem{
     public static void main(String[] args) {
        ArrayList<ArrayList<Integer>> inv = new ArrayList<>();

        inv.add(new ArrayList<>());
        inv.get(0).add(5);
        inv.get(0).add(12);
        inv.get(0).add(3);

        inv.add(new ArrayList<>());
        inv.get(1).add(8);
        inv.get(1).add(2);
        inv.get(1).add(15);

        inv.add(new ArrayList<>());
        inv.get(2).add(1);
        inv.get(2).add(20);
        inv.get(2).add(4);

        LinkedList<Integer>cstock=new LinkedList<Integer>();
        for(ArrayList<Integer>i:inv){
            for(Integer j:i){
                if(j<5){
                    cstock.add(j * 2);
                }
            }
        }

        for (ArrayList<Integer> product : inv) {
            System.out.println(product);
        }
        System.out.println(cstock);

    }
}