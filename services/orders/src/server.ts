import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

interface Order {
  id: number;
  product: string;
  amount: number;
}

const orders: Order[] = [
  {
    id: 1,
    product: "Laptop",
    amount: 1000,
  },
  {
    id: 2,
    product: "Phone",
    amount: 500,
  },
  {
    id: 3,
    product: "Tablet",
    amount: 200,
  },
];

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    service: "orders",
    data: orders,
  });
});

app.get("/:id", (req: Request, res: Response) => {
  const orderId = Number(req.params.id);

  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.json({
    success: true,
    service: "Order Service",
    data: order,
  });
});

// Public health endpoint
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API Gateway is healthy",
  });
});

const PORT = 4002;

app.listen(PORT, () => {
  console.log(`Order Service is running on port ${PORT}`);
});
