import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { fetchBySlugAndSelectProject, unselectProjectAction, selectProjectAction } from '@actions/projectActions';
import { AppState, projects } from '@reducers/index';
import Project from '@models/project';

import ProjectTitle from './components/ProjectTitle';
import ProjectImage from './components/ProjectImage';
import ProjectOverview from './components/ProjectOverview';
import NextProjectLink from './components/NextProjectLink';

import './ProjectDetailContainer.scss';

interface StateProps {
  project: Project | null;
  nextProject: Project | null;
}

interface DispatchProps  {
  fetchBySlugAndSelectProject: (slug: string) => void;
  selectProjectAction: (id: number) => void;
  unselectProjectAction: () => void;
}

type ProjectDetailProps = StateProps & DispatchProps & RouteComponentProps<any>;

class ProjectDetailContainer extends React.Component<ProjectDetailProps> {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.fetchBySlugAndSelectProject(slug);
  }

  componentWillUnmount() {
    this.props.unselectProjectAction();
  }

  render() {
    const { project, nextProject } = this.props;

    if (!project || !nextProject) {
      return null;
    }

    return (
      <div className="ProjectDetail">
        <ProjectTitle
          className="ProjectDetail__Title"
          title={project.name}
          type={project.type}
        />
        <ProjectImage
          className="ProjectDetail__HeroImage"
          src={project.heroImage.original}
        />
        <ProjectOverview
          className="ProjectDetail__Overview"
          text={project.description}
          links={project.links}
        />
        <NextProjectLink
          project={nextProject}
          onClick={this.changeProject}
        />
      </div>
    );
  }

  changeProject() {
    const { nextProject } = this.props;
    if (nextProject) {
      this.props.selectProjectAction(nextProject.id);
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  project: projects.getSelected(state),
  nextProject: projects.getNextProject(state),
});

const mapDispatchToProps = {
  fetchBySlugAndSelectProject,
  selectProjectAction,
  unselectProjectAction,
};

export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(ProjectDetailContainer);
