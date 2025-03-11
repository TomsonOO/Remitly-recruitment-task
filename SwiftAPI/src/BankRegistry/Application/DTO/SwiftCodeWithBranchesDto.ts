import { SwiftCodeDetailsDto } from './SwiftCodeDetailsDto';

export class SwiftCodeWithBranchesDto extends SwiftCodeDetailsDto {
  branches: SwiftCodeDetailsDto[];
}
