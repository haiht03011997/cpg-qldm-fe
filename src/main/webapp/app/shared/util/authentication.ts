import { ACTION } from 'app/config/constants';
import { subMenu } from '../layout/sidebar/config';
import { IRoles } from '../model/modal';
import * as _ from 'lodash';

export const AUTH_TOKEN_KEY = 'authenticationToken';

const splitAuthorities = (authority?: string): any[] => (authority ? JSON.parse(authority) : []);

export const checkPermissionUser = (authority: string | undefined, key?: string, actions = null): boolean => {
  const authorities = splitAuthorities(authority);
  if (actions) {
    return authorities.some(
      auth =>
        key
          ?.split(',')
          .some(
            value =>
              value.toLowerCase().includes(auth.modules.toLowerCase()) &&
              _.some(auth.actions, act => act === ACTION.ALL || value.toLowerCase().includes(act.toLowerCase())),
          ),
    );
  }
  return authorities.some(auth => key?.split(',').some(value => value.toLowerCase().includes(auth.modules.toLowerCase())));
};

const findSubMenuMatch = (path: string, menu: any[]): any => {
  for (const element of menu) {
    if (element.linkTo && path.includes(element.linkTo)) {
      return element;
    }

    if (element.items) {
      const subMenuMatch = findSubMenuMatch(path, element.items);
      if (subMenuMatch) {
        return {
          ...subMenuMatch,
          actions: element.actions,
        };
      }
    }
  }

  return undefined;
};

export const checkAuthorize = (authority: string | undefined, path: string): boolean => {
  const authorities = splitAuthorities(authority);

  if (!authorities.length) {
    return false;
  }

  const subMenuMatch = findSubMenuMatch(path, subMenu);

  return subMenuMatch ? checkPermissionUser(authority, subMenuMatch.key, subMenuMatch.actions) : false;
};

export const getActionRolesByPath = (authority: string | undefined, path: string): IRoles => {
  const result: IRoles = {};
  const authorities = splitAuthorities(authority);
  if (!authorities.length) {
    return result;
  }

  const subMenuMatch = findSubMenuMatch(path, subMenu);
  if (subMenuMatch) {
    const objectModules = _.find(authorities, item => {
      if (subMenuMatch.items) {
        return _.some(subMenuMatch.items, value => value.key.includes(item.modules));
      }
      return subMenuMatch.key.includes(item.modules);
    });
    return objectModules
      ? {
          ...result,
          add: createActionCheck(objectModules, ACTION.ADD),
          viewDetail: createActionCheck(objectModules, ACTION.DETAIL),
          delete: createActionCheck(objectModules, ACTION.DELETE),
          update: createActionCheck(objectModules, ACTION.UPDATE),
        }
      : result;
  }
};
const createActionCheck = (objectModules, actionType) => {
  return _.some(objectModules.actions, item => item === actionType || item === ACTION.ALL);
};
