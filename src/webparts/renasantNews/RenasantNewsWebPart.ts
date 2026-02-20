import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'RenasantNewsWebPartStrings';
import RenasantNews from './components/RenasantNews';
import { IRenasantNewsProps } from './components/IRenasantNewsProps';
import { IWebpartProps } from './models/IWebpartProps';
import { defaultConfig } from './constants/defaultConfig';

export default class RenasantNewsWebPart extends BaseClientSideWebPart<IWebpartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
      return super.onInit();
    });
  }

  public render(): void {
    const element: React.ReactElement<IRenasantNewsProps> = React.createElement(
      RenasantNews,
      {
        ...defaultConfig,
        ...this.properties,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams':
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }
          return environmentMessage;
        });
    }
    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Configure the Renasant News Webpart" },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Display",
              groupFields: [
                PropertyPaneTextField('title', { label: "Webpart Title" }),
                PropertyPaneToggle('showTitle', { label: "Show Title" }),
                PropertyPaneToggle('showSeeAll', { label: "Show 'See All' link" }),
                PropertyPaneTextField('seeAllUrl', { label: "'See All' URL" }),
                PropertyPaneSlider('maxItems', { label: "Max Items", min: 1, max: 20, step: 1 }),
                PropertyPaneChoiceGroup('layout', {
                  label: "Layout",
                  options: [
                    { key: 'list', text: 'List' },
                    { key: 'cards', text: 'Cards' },
                    { key: 'featured+list', text: 'Featured + List' }
                  ]
                }),
                PropertyPaneToggle('showViewCount', { label: "Show View Count" }),
                PropertyPaneToggle('showPublishedDate', { label: "Show Published Date" }),
                PropertyPaneToggle('showExcerpt', { label: "Show Excerpt" })
              ]
            },
            {
              groupName: "Branding",
              groupFields: [
                PropertyPaneTextField('headerImageUrl', { label: "Header Image URL" }),
                PropertyPaneToggle('useOneTeamBanner', { label: "Use One Team Banner (Fallback)" }),
                PropertyPaneTextField('accentColor', { label: "Accent Color (Hex)" }),
                PropertyPaneChoiceGroup('categoryColorMode', {
                  label: "Category Color Mode",
                  options: [
                    { key: 'auto', text: 'Auto (Brand Map)' },
                    { key: 'manual', text: 'Manual (Accent Color)' }
                  ]
                })
              ]
            },
            {
              groupName: "Content Source & Scheduling",
              groupFields: [
                PropertyPaneTextField('newsSourceSiteUrl', { label: "News Source Site URL" }),
                PropertyPaneDropdown('promotedStateFilter', {
                  label: "Promoted State Filter",
                  options: [
                    { key: 'all', text: 'All' },
                    { key: 'promoted', text: 'Promoted' },
                    { key: 'draft', text: 'Draft' }
                  ]
                }),
                PropertyPaneToggle('enableScheduling', { label: "Enable Scheduling" }),
                PropertyPaneTextField('scheduledStartField', { label: "Start Date Field Name", disabled: !this.properties.enableScheduling }),
                PropertyPaneTextField('scheduledEndField', { label: "End Date Field Name", disabled: !this.properties.enableScheduling }),
                PropertyPaneToggle('hideExpiredItems', { label: "Hide Expired Items", disabled: !this.properties.enableScheduling })
              ]
            }
          ]
        }
      ]
    };
  }
}
