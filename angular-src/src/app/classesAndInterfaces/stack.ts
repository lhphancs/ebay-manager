export class Stack {
    items:any;

    constructor(){
        this.items = [];
    }

    push(element){
        this.items.push(element);
    }

    pop(){
        return this.isEmpty() ? null:this.items.pop();
    }

    peek(){
        return this.items[this.items.length - 1];
    }

    isEmpty(){
        return this.items.length == 0;
    }

    printStack(){
        for (let i = 0; i < this.items.length; ++i)
            console.log(this.items[i])
        console.log("")
    }
}