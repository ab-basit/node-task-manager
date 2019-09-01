const express = require('express');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');
const cors = require('cors');
require('./db/mongoose');


const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => console.log(`listening at port ${port}`));