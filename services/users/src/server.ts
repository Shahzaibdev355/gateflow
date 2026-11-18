import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

interface User {
  id: number;
  name: string;
  role: string;
}

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "admin",
  },
  {
    id: 2,
    name: "Shahzaib",
    role: "Ai Engineer",
  },
  {
    id: 3,
    name: "Doe",
    role: "user",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    service: "users",
    data: users,
  });
});

app.get("/:id", (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    success: true,
    service: "User Service",
    data: user,
  });
});


const PORT = 4001;

app.listen(PORT, ()=>{
    console.log(`User Service is running on port ${PORT}`);
})