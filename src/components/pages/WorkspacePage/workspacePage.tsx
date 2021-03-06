import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from './workspacePage.module.scss';
import PageLayout from '../../layouts/PageLayout/pageLayout';
import Sidebar from '../../organisms/Sidebar/sidebar';
import WorkspaceWelcomeContent from '../../organisms/WorkspaceWelcomeContent/workspaceWelcomeContent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPallets } from '../../../redux/pallets/pallets.redux.actions';
import { fetchAllTemplates } from '../../../redux/templates/templates.redux.actions';
import { ESidebarMenus } from '../../organisms/Sidebar/sidebar.types';
import WorkspaceTemplateContent from '../../organisms/WorkspaceTemplateContent/workspaceTemplateContent';
import Typography from '../../atoms/Typography/typography';
import { EColor, EFontFamily } from '../../../shared/types/styles.types';
import config from '../../../shared/constants/config.constants';
import Button from '../../atoms/Button/button';
import { RootState } from '../../../redux/redux.types';
import { EPallets } from '../../../shared/types/pallets.types';
import WorkspaceGraphContent from '../../organisms/WorkspaceGraphContent/workspaceGraphContent';
import { toggleModal } from '../../../redux/ui/ui.redux.actions';
import { EModalName } from '../../../redux/ui/ui.redux.types';
import { resetGenerator } from '../../../redux/generator/generator.redux.actions';
import useWindowSize from '../../../shared/hooks/windowResize.hook';

enum EWorkspaceContent {
  WELCOME_TEXT = 'WELCOME_TEXT',
  PALLET_GRAPH = 'PALLET_GRAPH',
  TEMPLATE_TEXT = 'TEMPLATE_TEXT'
}

const WorkspacePage = () => {

  const dispatch = useDispatch();
  const [currentContent, setCurrentContent] = useState<EWorkspaceContent>(EWorkspaceContent.WELCOME_TEXT);
  const [displayDnDSurface, setDisplayDnDSurface] = useState<boolean>(false);

  const workspaceContentParentRef = useRef<HTMLDivElement>(null);
  const generatorDeps = useSelector<RootState, EPallets[]>(state => state.generator.dependencies);

  useWindowSize()

  const fetchData = () => {
    dispatch(fetchAllPallets());
    dispatch(fetchAllTemplates());
  }

  useEffect(fetchData, []);

  const renderWorkspaceContent = () => {
    switch (currentContent) {
      case EWorkspaceContent.WELCOME_TEXT: {
        return (
          <WorkspaceWelcomeContent
            onCreateBtnClick={() => setCurrentContent(EWorkspaceContent.PALLET_GRAPH)}
          />
        )
      }
      case EWorkspaceContent.TEMPLATE_TEXT: {
        return (<WorkspaceTemplateContent/>)
      }
      case EWorkspaceContent.PALLET_GRAPH: {
        return (
          <WorkspaceGraphContent
            displayDragAndDrop={displayDnDSurface}
            parentRef={workspaceContentParentRef}
          />
        )
      }
    }
  }

  const onSidebarMenuChange = (menu?: ESidebarMenus) => {
    if (menu === ESidebarMenus.TEMPLATES_MENU) {
      setCurrentContent(EWorkspaceContent.TEMPLATE_TEXT)
    } else {
      setCurrentContent(EWorkspaceContent.PALLET_GRAPH)
    }

    if (menu === ESidebarMenus.PALLETS_MENU) {
      setDisplayDnDSurface(true)
    } else {
      setDisplayDnDSurface(false)
    }
  }

  return (
    <PageLayout fluid={true} className={styles.workspacePage}>
      <div className={styles.sidebarContent}>
        <Sidebar onMenuChange={onSidebarMenuChange}/>
      </div>

      <div className={styles.workspaceContent}>
        <div className='d-flex justify-content-end pb-1'>
          { (currentContent === EWorkspaceContent.PALLET_GRAPH && generatorDeps.length) ?
            <Fragment>
              <Button
                onClick={() => dispatch(resetGenerator())}
                theme='flat'
                className={styles.resetButton}
              >
                <Typography element={'span'} fontSize={14}>
                  Reset
                </Typography>
              </Button>
              <Button
                onClick={() => dispatch(toggleModal(EModalName.GENERATE_CODE, true))}
                theme='outline-tertiary'
              >
                <Typography element={'span'} fontSize={14}>
                  Deploy Codebase
                </Typography>
              </Button>
            </Fragment> : null
          }
        </div>
        <div className='flex-grow-1 d-flex align-items-center justify-content-center' ref={workspaceContentParentRef}>
          {renderWorkspaceContent()}
        </div>
        <div className='d-flex justify-content-end pt-1'>
          <Typography
            element='span'
            fontSize={12}
            fontFamily={EFontFamily.POPPINS}
            color={EColor.GRAY_DARK}
            className='mr-6'
          >
            {`v ${config.APP_VERSION}`}
          </Typography>
          <Typography
            element='span'
            fontSize={12}
            fontFamily={EFontFamily.POPPINS}
            color={EColor.GRAY_DARK}
          >
            About
          </Typography>
        </div>
      </div>
    </PageLayout>
  )
}

export default WorkspacePage;
