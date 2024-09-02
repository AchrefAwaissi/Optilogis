import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.xoxfzvh.mongodb.net/',
    ),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
