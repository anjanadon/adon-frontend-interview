import express from 'express';
import { db } from '../admin';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));

app.get('/orders', async (req, res, next) => {
  try {
    const snapshot = await db.collection('orders').get();
    if (snapshot.empty) {
      return res.status(404).send({ status: 'FAIL', message: 'NOT_FOUND' });
    }
    const docs = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return res.send({ status: 'SUCCESS', docs });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

app.get('/orders/:id', async (req, res, next) => {
  try {
    const collRef = db.collection('orders').doc(req.params.id);
    const snapshot = await collRef.get();

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        order: snapshot.data(),
        id: snapshot.id,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.patch('/orders/:id/status', async (req, res, next) => {
  try {
    console.log(req.params);
    const collRef = db.collection('orders').doc(req.params.id);
    if (!req.body.status) {
      return res.send({ status: 'FAIL', message: 'INVALID_STATUS_FIELD' });
    }
    const reqBody = { status: req.body.status };
    const updatedDoc = await collRef.update(reqBody);
    res.status(200).json({
      status: 'SUCCESS',
      data: {
        updatedDoc,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export { app };
