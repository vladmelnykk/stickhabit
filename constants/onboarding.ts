import { t } from 'i18next';

export const ONBOARDING_PAGES = [
  {
    title: t('onboarding.first.title'),
    description: t('onboarding.first.description'),
    image: require('@/assets/images/onboarding/home-frame.png')
  },
  {
    title: t('onboarding.second.title'),
    description: t('onboarding.second.description'),
    image: require('@/assets/images/onboarding/stats-frame.png')
  },
  {
    title: t('onboarding.third.title'),
    description: t('onboarding.third.description'),
    image: require('@/assets/images/onboarding/habit-frame.png')
  },
  {
    title: t('onboarding.fourth.title'),
    description: t('onboarding.fourth.description'),
    image: require('@/assets/images/onboarding/management-frame.png')
  }
];
