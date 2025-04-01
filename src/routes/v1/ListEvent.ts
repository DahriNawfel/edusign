import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import logger from '@logger';
import Edusign from '@_edusign/api';

const EVENTS_FILE_PATH = path.join(__dirname, '../data/events.json');


function readEvents(): any[] {
  try {

    const dir = path.dirname(EVENTS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    

    if (!fs.existsSync(EVENTS_FILE_PATH)) {
      fs.writeFileSync(EVENTS_FILE_PATH, '[]', 'utf8');
      return [];
    }
    
    const data = fs.readFileSync(EVENTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Erreur lors de la lecture des événements:', error);
    return [];
  }
}


function writeEvents(events: any[]): void {
  try {
    const dir = path.dirname(EVENTS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(events, null, 2), 'utf8');
  } catch (error) {
    logger.error('Erreur lors de l\'écriture des événements:', error);
  }
}

export default async function HandleEventFormSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info('Réception des données du formulaire événement');

    const eventTitle = req.body['my-input'];
    const eventDate = req.body['my-datepicker'];
    const eventHours = req.body['hour-input'];
    const eventDescription = req.body['my-textarea'];
    
    logger.info(`Événement reçu: ${eventTitle}, ${eventDate}, ${eventHours}`);


    const events = readEvents();
    

    const newEvent = [eventTitle, eventDate, eventHours, eventDescription];
    events.push(newEvent);
    
    writeEvents(events);

    const blocksApi = new Edusign.Blocks();

    blocksApi.Title('Events', 'All Events');
    

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      blocksApi.Divider(`divider${i+1}`);
      blocksApi.Text(`Event ${i+1} Title`, event[0]);
      blocksApi.Text(`Event ${i+1} Date`, event[1]);
      blocksApi.Text(`Event ${i+1} Hours`, event[2]);
      blocksApi.Text(`Event ${i+1} Description`, event[3]);
    }

    blocksApi.Button('btn', 'primary', 'Go to create', 'https://03d8-37-169-169-15.ngrok-free.app/v1/create', {
      name: 'create-btn',
    });
    
    blocksApi.validator(blocksApi.toJson());
    res.send(blocksApi.toJson());
    
  } catch (error) {
    logger.error('Erreur lors du traitement du formulaire d\'événement:', error);
    return next(error);
  }
}