export type ICadrartImageFolder = 'job' | 'task' | 'team-member';

export type ICadrartImageSize = 's' | 'm' | 'l' | 'o';

export type ICadrartImageParams = {
  name: string;
  folder: ICadrartImageFolder;
  size?: ICadrartImageSize;
  alt?: string;
};
