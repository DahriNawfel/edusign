import { NextFunction, Request, Response } from 'express';
import Edusign from '@_edusign/api';

import logger from '@logger';

/**
 * Affiche un formulaire pour créer un événement pour une école spécifique.
 *
 * @param req - L'objet de requête HTTP, qui contient le paramètre `schoolId`.
 * @param res - L'objet de réponse HTTP utilisé pour envoyer la réponse au client.
 * @param next - La fonction middleware suivante dans le cycle requête-réponse d'Express.js.
 *
 * @returns Une réponse JSON avec le formulaire de création d'événement.
 */
export default async function CreateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolId = req.schoolId as string;
    logger.info(`Affichage du formulaire d'événement pour l'école: ${schoolId}`);

    const blocksApi = new Edusign.Blocks();
    
    blocksApi.Title('title', 'Créer un nouvel événement');
    blocksApi.Text('subheader', `École: ${schoolId}`);
    
    blocksApi.Divider('divider1');
    

    blocksApi.Form(
      "createForm",
      [
          {
              type: "input",
              name: "my-input",
              label: "Titre de l'événement",
              placeholder: "Titre",
              value:  "",
          },
          {
              type: "datepicker",
              name: "my-datepicker",
              label: "Date de l'événement",
              value: new Date().toISOString(),
          },
          {
              type: "input",
              name: "hour-input",
              label: "Heure de l'événement",
              placeholder: "17h00-19h00",
              value:  "",
          },
          {
              type: "textarea",
              name: "my-textarea",
              label: "Description de l'événement",
              value:  "",
          },
      ],
      {
          name: "submit",
          label: "Submit",
          style: "secondary",
      },
      "https://03d8-37-169-169-15.ngrok-free.app/v1/allEvents"
  );
    
    res.send(blocksApi.toJson());
  } catch (error) {
    logger.error('Erreur lors de l\'affichage du formulaire d\'événement:', error);
    return next(error);
  }
}