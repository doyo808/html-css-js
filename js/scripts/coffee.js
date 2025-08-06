export function Americano (name, price, taste) {
    this.name = name;
    this.price = price;
    this.taste = taste;

    this.drink = () => {
        console.log(`${this.name}을 마셨습니다.`);
    }
}