import express, { Express } from 'express';
import accountsRoutes from './Routes/accountsRoutes';
import bodyParser from 'body-parser';
class Server {
  app: Express = express();
  port: number = Number(process.env.PORT) || 3000;

  applyMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use('/accounts', accountsRoutes);
  }

  start() {
    this.applyMiddlewares();
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export const server = new Server();
