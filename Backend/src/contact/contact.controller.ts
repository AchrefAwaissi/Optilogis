import { Controller, Post, Body } from '@nestjs/common';
   import { ContactService } from './contact.service';
   import { ContactDto } from './dto/contact.dto';

   @Controller('contact')
   export class ContactController {
     constructor(private readonly contactService: ContactService) {}

     @Post()
     async submitContact(@Body() contactDto: ContactDto) {
       return this.contactService.submitContact(contactDto);
     }
   }