import express from 'express';
import { db } from '../admin';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));

app.post('/refunds', async (req, res, next) => {
  try {
    const { orderId, refundAmount, fullOrPartial } = req.body;
    if (!orderId)
      return res
        .status(400)
        .json({ status: 'FAIL', message: 'INVALID_FIELD orderId' });

    if (!refundAmount)
      return res
        .status(400)
        .json({ status: 'FAIL', message: 'INVALID_FIELD refundAmount' });

    if (fullOrPartial !== 'full' && fullOrPartial !== 'partial') {
      return res.status(400).json({
        status: 'FAIL',
        message: 'INVAILD_FIELD fullOrPartial, use "full" or "partial"',
      });
    }
    const data = await db
      .collection('refunds')
      .add({ orderId, refundAmount, fullOrPartial });

    return res.send({
      status: 'SUCCESS',
      data: {
        data: data.path,
        id: data.id,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

app.get('/refunds/:id', async (req, res, next) => {
  try {
    const collRef = db.collection('refunds').doc(req.params.id);
    const snapshot = await collRef.get();

    if (!snapshot.data()) {
      return res.status(400).json({ status: 'FAIL', message: 'NOT_FOUND' });
    }

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        order: snapshot.data(),
        id: snapshot.id,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

app.get('/refunds', async (req, res, next) => {
  try {
    const collRef = db.collection('refunds');
    const snapshot = await collRef.get();

    const docs = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        refunds: docs,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export { app };
