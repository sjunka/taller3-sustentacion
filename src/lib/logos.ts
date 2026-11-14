import type { LogoId } from './tipos'
import github from '../assets/logos/github.svg'
import githubactions from '../assets/logos/githubactions.svg'
import docker from '../assets/logos/docker.svg'
import sonarcloud from '../assets/logos/sonarcloud.svg'
import python from '../assets/logos/python.svg'
import laptop from '../assets/logos/laptop.svg'
import lock from '../assets/logos/lock.svg'
import ecs from '../assets/logos/ecs.svg'
import elb from '../assets/logos/elb.svg'
import s3 from '../assets/logos/s3.svg'
import cloudwatch from '../assets/logos/cloudwatch.svg'
import terraform from '../assets/logos/terraform.svg'
import fargate from '../assets/logos/fargate.svg'

/** inv: logo oscuro que se invierte en tema oscuro. */
export const logos: Record<LogoId, { src: string; inv?: boolean }> = {
  github: { src: github, inv: true },
  githubactions: { src: githubactions },
  docker: { src: docker },
  sonarcloud: { src: sonarcloud },
  python: { src: python },
  laptop: { src: laptop, inv: true },
  lock: { src: lock, inv: true },
  ecs: { src: ecs },
  elb: { src: elb },
  s3: { src: s3 },
  cloudwatch: { src: cloudwatch },
  terraform: { src: terraform },
  fargate: { src: fargate },
}
