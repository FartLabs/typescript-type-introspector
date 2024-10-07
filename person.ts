export class Person {
  public occupation: string = "Software Engineer";

  public readonly birthDate: Date = new Date("2001-03-24");

  public constructor(
    public name: string,
    public surname: string,
  ) {}

  public get fullName() {
    return `${this.name} ${this.surname}`;
  }

  public set fullName(fullName: string) {
    const [name, surname] = fullName.split(" ");
    this.name = name;
    this.surname = surname;
  }

  public greet() {
    console.log(`Hello, ${this.name} ${this.surname}!`);
  }
}
