import { Tree } from 'antd';
import { ACTION } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import { IDecentralize } from 'app/shared/model/decentralize/form/form.modal';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { configFunctions } from '../config';
const { TreeNode } = Tree;

type IDecentralizeFunc = {
  userLogin: string;
  handlePayload: (payload: IDecentralize[]) => void;
};

const DecentralizeFuncForm = ({ userLogin, handlePayload }: IDecentralizeFunc) => {
  const { data: detail } = useAppSelector(state => state.decentralizeForm);
  const [autoExpandParent] = useState(true);
  const [checkedKeyFuncs, setCheckedKeyFuncs] = useState([]);

  useEffect(() => {
    if (detail.length >= 0) {
      const arrayKeysFunc = _.filter(detail, value => {
        return value.permission === 'p';
      });
      handleDefaultCheckedKeyFuncs(arrayKeysFunc);
    }
  }, [detail]);

  useEffect(() => {
    if (checkedKeyFuncs) {
      handleFormPayload();
    }
  }, [checkedKeyFuncs]);

  const handleDefaultCheckedKeyFuncs = arrays => {
    let defaultKeys = [];
    arrays.forEach(element => {
      const item = findItemByAction(element, configFunctions);
      if (item) {
        if (item.key) {
          defaultKeys = processKeys(item, defaultKeys, element.actions);
        } else {
          const childItem = findItemByAction(element, item.items);
          if (childItem) {
            defaultKeys = processKeys(childItem, defaultKeys, element.actions);
          }
        }
      }
    });
    setCheckedKeyFuncs(defaultKeys);
  };

  const processKeys = (item, defaultKeys, actions) => {
    const childKeys = item.items?.map(value => value.key);
    if (_.find(actions, act => act === ACTION.ALL)) {
      defaultKeys.push(item.key);
      if (childKeys.length > 0) {
        defaultKeys = defaultKeys.concat(childKeys);
      }
    } else {
      if (childKeys.length > 0) {
        const keys = _.filter(childKeys, key => _.some(actions, act => key?.includes(act)));
        defaultKeys = defaultKeys.concat(keys);
      }
    }
    return defaultKeys;
  };

  const handleFormPayload = () => {
    let payloadFuncs: IDecentralize[] = [];
    const groupedActions = checkedKeyFuncs.reduce((acc, action) => {
      const [actionType, actionOperation] = action.toString().split('/');

      if (!acc[actionType]) {
        acc[actionType] = [];
      }
      if (actionOperation) {
        acc[actionType].push(actionOperation);
      }

      return acc;
    }, {});

    const arrayOfObjects = Object.entries(groupedActions).map(([type, actions]: any) => {
      const result: IDecentralize = {
        userLogin,
        type,
        permission: 'p',
        actions,
      };
      if (actions.includes(ACTION.ALL)) {
        return {
          ...result,
          actions: [`${ACTION.ALL}`],
        };
      } else {
        return result;
      }
    });
    payloadFuncs = payloadFuncs.concat(arrayOfObjects);
    handlePayload(payloadFuncs);
  };

  const findItemByAction = (element, array) => {
    return _.find(array, value => {
      return (
        value.key?.includes(element.type) ||
        _.some(value.items, child => {
          return child.key?.includes(element.type);
        })
      );
    });
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    if (checkedKeysValue) {
      setCheckedKeyFuncs(checkedKeysValue);
    }
  };

  const renderTreeNodes = nodes => {
    return nodes.map(({ title, key, items }) => {
      return (
        <TreeNode title={title} key={key}>
          {items && renderTreeNodes(items)}
        </TreeNode>
      );
    });
  };

  return (
    <Tree checkable autoExpandParent={autoExpandParent} onCheck={onCheck} checkedKeys={checkedKeyFuncs}>
      {renderTreeNodes(configFunctions)}
    </Tree>
  );
};
export default DecentralizeFuncForm;
