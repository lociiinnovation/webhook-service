import { Db, MongoClient } from 'mongodb';

let connection: MongoClient;
let db: Db;

export const connectDatabase = async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL);
    db = await connection.db("verification-events");
};

export const insertDocument = async (collectionName, document) => {
    const collection = db.collection(collectionName);
    await collection.insertOne(document);
};

export const insertManyDocument = async (collectionName, documents) => {
    const collection = db.collection(collectionName);
    await collection.insertMany(documents);
};

export const find = async (collectionName, verificationId): Promise<any> => {
    const collection = db.collection(collectionName);
    console.log(await collection.find({ verificationId }));
    return collection.find({});
};

export const deleteAll = async (collectionName) => {
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
};

export const disconnectDatabase = async () => {
    await connection.close();
};
