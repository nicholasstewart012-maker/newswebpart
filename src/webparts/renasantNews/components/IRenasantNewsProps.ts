import { IWebpartProps } from '../models/IWebpartProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IRenasantNewsProps extends IWebpartProps {
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
}
