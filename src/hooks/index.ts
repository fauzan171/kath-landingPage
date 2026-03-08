// Base API hooks
export { useApi, useApiWithParams, useMutation } from './useApi';

// Entity hooks
export {
  usePortfolio,
  usePortfolioItem,
  usePortfolioCategories,
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
} from './usePortfolio';

export {
  useNews,
  useNewsItem,
  useNewsById,
  useNewsCategories,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from './useNews';

export {
  useCompetitions,
  useMainCompetition,
  useCompetition,
  useCreateCompetition,
  useUpdateCompetition,
  useDeleteCompetition,
  useRegisterCompetition,
} from './useCompetition';

export {
  useFeaturedEvents,
  useFeaturedEvent,
  useCreateFeaturedEvent,
  useUpdateFeaturedEvent,
  useDeleteFeaturedEvent,
  useReorderFeaturedEvents,
} from './useFeaturedEvents';

// Auth hooks
export { useAuth, useIsAuthenticated, useCurrentUser } from './useAuth';