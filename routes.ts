import { Router } from "https://deno.land/x/oak/mod.ts"; 
import { Book } from "./types.ts"
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const router = new Router();


let books: Book[] = [
    {
        id: "1",
        title: "Book 1",
        author: "one"
    },
    {
        id: "2",
        title: "Book 2",
        author: "two"
    },
    {
        id: "3",
        title: "Book 3",
        author: "three"
    },
];

// node에서는 (req, res) 가 들어가지만
// context안에 req, res가 들어있음
router.get('/', (context) => {
    context.response.body = "Hello Deno, this page is Root"
})

    .get("/books", (context) =>{
        context.response.body = books;
    })
    .post("/book", async (context) =>{
        

        // 만약 정보를 제공하지 않았다면
        if(!context.request.hasBody){
            context.response.status = 400;
            context.response.body = "데이터가 없습니다.";
        }else{
            // promise로 전달받기 때문에 async, await
            const value = await context.request.body().value;

            // 정보를 제공 받았다면
            // 우선 임의로 아이디를 생성하고 제공받은 정보로 book오브젝트를 만들어준다.
            const book: Book = value;
            
            //uuid
            book.id = v4.generate();
            books.push(book)
            context.response.status = 201;
            context.response.body = book;
        }
    })
    .get("/book/:id", async (context) =>{
        // books안에 있는 책들중 param의 값과 같은 id를 가진 book 찾기

        const book: Book | undefined = books.find((b) => b.id === context.params.id);

        if(book){
            context.response.body = book;
            context.response.status = 200;            
        }else{
            context.response.body = "책을 찾지 못했습니다.";
            context.response.status = 404;
        }
    })

    export default router;