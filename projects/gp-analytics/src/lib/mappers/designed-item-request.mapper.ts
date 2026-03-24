import { DesignerSelectionState } from '../interfaces/selected-field';
import {
  BuildDesignedItemRequestOptions,
  DesignedItemRequest,
} from '../interfaces/designed-item-request';

function defaultItemName(artifactType: DesignerSelectionState['artifactType']): string {
  if (artifactType === 'graph') {
    return 'Graph item';
  }

  if (artifactType === 'kpi') {
    return 'KPI item';
  }

  return 'Tabular item';
}

export function buildDesignedItemRequest(
  selection: DesignerSelectionState,
  options?: BuildDesignedItemRequestOptions,
): DesignedItemRequest {
  return {
    name: options?.name ?? defaultItemName(selection.artifactType),
    artifactType: selection.artifactType,
    graphType: selection.artifactType === 'graph' ? selection.graphType : undefined,
    fields: selection.fields,
    style: options?.style,
    requestedAt: options?.requestedAt ?? new Date().toISOString(),
  };
}
