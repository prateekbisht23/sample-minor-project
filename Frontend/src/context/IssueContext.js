import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  issues: [],
  userIssues: [],
  nearbyIssues: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    status: null,
    priority: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Action types
const ISSUE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ISSUES: 'SET_ISSUES',
  SET_USER_ISSUES: 'SET_USER_ISSUES',
  SET_NEARBY_ISSUES: 'SET_NEARBY_ISSUES',
  ADD_ISSUE: 'ADD_ISSUE',
  UPDATE_ISSUE: 'UPDATE_ISSUE',
  DELETE_ISSUE: 'DELETE_ISSUE',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
};

// Reducer
const issueReducer = (state, action) => {
  switch (action.type) {
    case ISSUE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case ISSUE_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case ISSUE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ISSUE_ACTIONS.SET_ISSUES:
      return {
        ...state,
        issues: action.payload.issues,
        pagination: action.payload.pagination || state.pagination,
        isLoading: false,
        error: null,
      };

    case ISSUE_ACTIONS.SET_USER_ISSUES:
      return {
        ...state,
        userIssues: action.payload.issues,
        pagination: action.payload.pagination || state.pagination,
        isLoading: false,
        error: null,
      };

    case ISSUE_ACTIONS.SET_NEARBY_ISSUES:
      return {
        ...state,
        nearbyIssues: action.payload,
        isLoading: false,
        error: null,
      };

    case ISSUE_ACTIONS.ADD_ISSUE:
      return {
        ...state,
        issues: [action.payload, ...state.issues],
        userIssues: [action.payload, ...state.userIssues],
        isLoading: false,
        error: null,
      };

    case ISSUE_ACTIONS.UPDATE_ISSUE:
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue && issue._id && action.payload && action.payload._id && issue._id === action.payload._id ? action.payload : issue
        ),
        userIssues: state.userIssues.map(issue =>
          issue && issue._id && action.payload && action.payload._id && issue._id === action.payload._id ? action.payload : issue
        ),
        nearbyIssues: state.nearbyIssues.map(issue =>
          issue && issue._id && action.payload && action.payload._id && issue._id === action.payload._id ? action.payload : issue
        ),
        isLoading: false,
        error: null,
      };

    case ISSUE_ACTIONS.DELETE_ISSUE:
      return {
        ...state,
        issues: state.issues.filter(issue => issue && issue._id && issue._id !== action.payload),
        userIssues: state.userIssues.filter(issue => issue && issue._id && issue._id !== action.payload),
        nearbyIssues: state.nearbyIssues.filter(issue => issue && issue._id && issue._id !== action.payload),
        isLoading: false,
        error: null,
      };

    case ISSUE_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case ISSUE_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          category: null,
          status: null,
          priority: null,
        },
      };

    case ISSUE_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const IssueContext = createContext();

// Issue provider component
export const IssueProvider = ({ children }) => {
  const [state, dispatch] = useReducer(issueReducer, initialState);

  const setLoading = (isLoading) => {
    dispatch({ type: ISSUE_ACTIONS.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ISSUE_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ISSUE_ACTIONS.CLEAR_ERROR });
  };

  const setIssues = (issues, pagination) => {
    dispatch({
      type: ISSUE_ACTIONS.SET_ISSUES,
      payload: { issues, pagination },
    });
  };

  const setUserIssues = (issues, pagination) => {
    dispatch({
      type: ISSUE_ACTIONS.SET_USER_ISSUES,
      payload: { issues, pagination },
    });
  };

  const setNearbyIssues = (issues) => {
    dispatch({
      type: ISSUE_ACTIONS.SET_NEARBY_ISSUES,
      payload: issues,
    });
  };

  const addIssue = (issue) => {
    dispatch({
      type: ISSUE_ACTIONS.ADD_ISSUE,
      payload: issue,
    });
  };

  const updateIssue = (issue) => {
    dispatch({
      type: ISSUE_ACTIONS.UPDATE_ISSUE,
      payload: issue,
    });
  };

  const deleteIssue = (issueId) => {
    dispatch({
      type: ISSUE_ACTIONS.DELETE_ISSUE,
      payload: issueId,
    });
  };

  const setFilters = (filters) => {
    dispatch({
      type: ISSUE_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  };

  const clearFilters = () => {
    dispatch({ type: ISSUE_ACTIONS.CLEAR_FILTERS });
  };

  const setPagination = (pagination) => {
    dispatch({
      type: ISSUE_ACTIONS.SET_PAGINATION,
      payload: pagination,
    });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setIssues,
    setUserIssues,
    setNearbyIssues,
    addIssue,
    updateIssue,
    deleteIssue,
    setFilters,
    clearFilters,
    setPagination,
  };

  return (
    <IssueContext.Provider value={value}>
      {children}
    </IssueContext.Provider>
  );
};

// Custom hook to use issue context
export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

export default IssueContext;
