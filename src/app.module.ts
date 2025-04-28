import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/datawow'),
    AuthModule,
    PostModule,
    CategoryModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
