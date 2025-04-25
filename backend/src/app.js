import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from "http";
import { initSocket } from "./utils/socketHandler.js";
import passport from "./utils/passport.js";
import { ApiError } from "./utils/ApiError.js";

const app = express()
const server = http.createServer(app);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            "http://localhost:5173",
            process.env.CORS_ORIGIN
        ].filter(Boolean);
        
        // Check if origin matches any allowed origin or is a render.com subdomain
        if (allowedOrigins.includes(origin) || /^https:\/\/.*\.onrender\.com$/.test(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // For development, allow all origins. Change to false in production if needed
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
}))
// app.use(cors())


app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 

import userRouter from "./routes/user.routes.js"
import jobRouter from "./routes/jobs.routes.js"
import applicationRouter from "./routes/application.routes.js"
import adminRouter from "./routes/admin.routes.js"
import chatbotRouter from "./routes/chatbot.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import chatRouter from "./routes/chat.routes.js"
import resumeAnalyseRouter from "./routes/analyse.routes.js"
import complaintRoute from "./routes/complaint.routes.js"

// oauth route

import authRoutes from "./routes/oAuth.routes.js";

// routes declaration 

app.use("/v1/users",userRouter)
app.use("/v1/jobs",jobRouter)
app.use("/v1/application",applicationRouter)
app.use("/v1/admin",adminRouter)
app.use("/v1/chatbot",chatbotRouter)
app.use("/v1/payment",paymentRouter)
app.use("/v1/chat",chatRouter)
app.use("/v1/resume",resumeAnalyseRouter)
app.use("/v1/complaint",complaintRoute)

app.use(passport.initialize());
app.use("/auth", authRoutes);

initSocket(server);
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
    console.log(`🚀 Chat server running on port ${PORT} and auto deploy on render configure!`);
  });

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app }