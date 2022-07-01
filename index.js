const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lch42.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        
        // collection
        const tasksCollection = client.db('task_manager').collection('tasks');

        //getting all tasks
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = tasksCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        app.get('/checked-tasks', async (req, res) => {
            const query = {checked: true};
            const cursor = tasksCollection.find(query);
            const checkedTasks = await cursor.toArray();
            res.send(checkedTasks);
        });

        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const task = await tasksCollection.insertOne(newTask);
            res.send(task);
        });

        app.patch('/tasks/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const updatedDoc = {
                $set: {
                    checked: true,
                }
            }
            const updatedTask = await tasksCollection.updateOne(filter, updatedDoc);
            res.send(updatedTask);
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Hello from task manager');
})

app.listen(port, ()=>{
    console.log(`task manager listening on ${port}`);
})