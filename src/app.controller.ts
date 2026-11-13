import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import type ParkoloDto from './parkolo.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getIndex() {
    return {
      parkolasok: await this.appService.getParkolasok() 
    }
  }

  @Post()
  @Render('index')
  async postIndex(@Body() body: ParkoloDto) {
    try {
      const rendszamRegex = /^[A-Z]{2} [A-Z]{2}\-[0-9]{3}$/gm;
      if(!rendszamRegex.test(body.rendszam.trim())) {
        throw new Error('Rossz rendszám!');
      }
      const tulajdonosRegex = /.{6,}/gmi;
      if (!tulajdonosRegex.test(body.tulajdonos.trim())) {
        throw new Error('Rendesen töltsd ki a tulajdonost!');
      }
      const idotartam = Number(body.idotartam.trim())
      if (idotartam < 0 || idotartam > 24) {
        throw new Error('Rossz Időtartam!');
      }
      const fizetve = body.fizetve === 'on'? 1 : 0;
      return {
        errorState: false,
        p: 'Sikeres feltöltés!',
        parkolasok: await this.appService.postParkolasok(body.rendszam.trim(),body.tulajdonos.trim(),idotartam,fizetve)
      }
    } catch (err) {
      if (err instanceof Error) {
        return {
          errorState: true,
          p: err.message,
          parkolasok: await this.appService.getParkolasok()
        }
      }
    }
  }
}
