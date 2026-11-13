import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise'
import Parkolas from './parkolas.js';

const mysqlConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parkolohely'
})


@Injectable()
export class AppService {
  async getParkolasok() {
    const [results] =  await mysqlConnection.execute(
      'SELECT id,rendszam,tulajdonos,idotartam,fizetve FROM parkolas'
    )
    return results as Parkolas[]
  }

  async postParkolasok(rendszam: string, tulajdonos: string, idotartam: number, fizetve: number) {
    const [post] = await mysqlConnection.execute(
      'INSERT INTO parkolas (rendszam,tulajdonos,idotartam,fizetve) VALUES (?,?,?,?)',
      [rendszam,tulajdonos,idotartam,fizetve]
    )
    return this.getParkolasok()
  }
}
