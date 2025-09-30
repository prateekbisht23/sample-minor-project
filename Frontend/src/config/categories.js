// Issue Categories Configuration
// This file contains the hardcoded category data as allowed by the requirements
export const ISSUE_CATEGORIES = [
  { 
    id: 'ice', 
    label: 'Ice on the road', 
    icon: '❄️', 
    color: '#8b5cf6',
    description: 'Ice patches, slippery surfaces, winter hazards'
  },
  { 
    id: 'pothole', 
    label: 'Hole in the road', 
    icon: '🚧', 
    color: '#f59e0b',
    description: 'Potholes, road damage, surface issues'
  },
  { 
    id: 'trash', 
    label: 'Trash', 
    icon: '🗑️', 
    color: '#10b981',
    description: 'Garbage, litter, waste disposal issues'
  },
  { 
    id: 'streetlight', 
    label: 'Street Light', 
    icon: '💡', 
    color: '#f59e0b',
    description: 'Broken or malfunctioning street lights'
  },
  { 
    id: 'traffic', 
    label: 'Traffic Signal', 
    icon: '🚦', 
    color: '#ef4444',
    description: 'Traffic lights, road signs, traffic control'
  },
  { 
    id: 'other', 
    label: 'Other', 
    icon: '⚠️', 
    color: '#6b7280',
    description: 'Other civic issues not listed above'
  },
];

// Category picker configuration for the reporting flow
export const CATEGORY_PICKER_CONFIG = {
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
  itemStyle: {
    marginRight: 12,
    minWidth: 120,
  }
};
