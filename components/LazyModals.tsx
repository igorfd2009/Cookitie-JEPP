import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useState } from 'react';

// Lazy loading dos modais pesados
const UserProfile = lazy(() => import('./user/UserProfile').then(module => ({ default: module.UserProfile })));
const AuthModals = lazy(() => import('./auth/AuthModals').then(module => ({ default: module.AuthModals })));
// const UserProfileEdit = lazy(() => import('./user/UserProfileEdit'));

// Fallback personalizado para cada tipo de modal
const ModalFallback = ({ type = 'default' }: { type?: string }) => {
  const fallbackConfigs = {
    profile: {
      text: 'Carregando perfil...',
      size: 'lg' as const,
      color: 'blue' as const
    },
    auth: {
      text: 'Carregando autenticação...',
      size: 'md' as const,
      color: 'green' as const
    },
    edit: {
      text: 'Carregando editor...',
      size: 'md' as const,
      color: 'purple' as const
    },
    default: {
      text: 'Carregando...',
      size: 'md' as const,
      color: 'blue' as const
    }
  };

  const config = fallbackConfigs[type as keyof typeof fallbackConfigs] || fallbackConfigs.default;

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <LoadingSpinner 
        size={config.size} 
        color={config.color} 
        className="mb-4"
      />
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {config.text}
      </p>
    </div>
  );
};

// Wrapper para UserProfile com lazy loading
interface LazyUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export function LazyUserProfile({ isOpen }: LazyUserProfileProps) {
  if (!isOpen) return null;

  return (
    <Suspense fallback={<ModalFallback type="profile" />}>
      <UserProfile />
    </Suspense>
  );
}

// Wrapper para AuthModals com lazy loading
interface LazyAuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function LazyAuthModals({ isOpen, onClose, defaultTab }: LazyAuthModalsProps) {
  if (!isOpen) return null;

  return (
    <Suspense fallback={<ModalFallback type="auth" />}>
      <AuthModals isOpen={isOpen} onClose={onClose} defaultTab={defaultTab} />
    </Suspense>
  );
}

// Wrapper para UserProfileEdit com lazy loading (comentado até implementar)
// interface LazyUserProfileEditProps {
//   isOpen: boolean;
//   onClose: () => void;
//   userProfile?: any;
// }

// export function LazyUserProfileEdit({ isOpen, onClose, userProfile }: LazyUserProfileEditProps) {
//   if (!isOpen) return null;

//   return (
//     <Suspense fallback={<ModalFallback type="edit" />}>
//       <UserProfileEdit isOpen={isOpen} onClose={onClose} userProfile={userProfile} />
//     </Suspense>
//   );
// }

// Hook para gerenciar lazy loading de modais
export function useLazyModal() {
  const [modalStates, setModalStates] = useState({
    profile: false,
    auth: false
  });

  const openModal = (modalType: keyof typeof modalStates) => {
    setModalStates(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType: keyof typeof modalStates) => {
    setModalStates(prev => ({ ...prev, [modalType]: false }));
  };

  const closeAllModals = () => {
    setModalStates({
      profile: false,
      auth: false
    });
  };

  return {
    modalStates,
    openModal,
    closeModal,
    closeAllModals
  };
}

// Componente de exemplo de uso
export function LazyModalsExample() {
  const { modalStates, openModal, closeModal } = useLazyModal();

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={() => openModal('profile')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Abrir Perfil
        </button>
        
        <button
          onClick={() => openModal('auth')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Abrir Autenticação
        </button>
        
        {/* <button
          onClick={() => openModal('edit')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Editar Perfil
        </button> */}
      </div>

      {/* Modais com lazy loading */}
      <LazyUserProfile 
        isOpen={modalStates.profile} 
        onClose={() => closeModal('profile')} 
      />
      
      <LazyAuthModals 
        isOpen={modalStates.auth} 
        onClose={() => closeModal('auth')} 
      />
      
      {/* <LazyUserProfileEdit 
        isOpen={modalStates.edit} 
        onClose={() => closeModal('edit')} 
      /> */}
    </div>
  );
}

// Versão otimizada para uso direto
export const LazyModals = {
  UserProfile: LazyUserProfile,
  AuthModals: LazyAuthModals,
  useLazyModal,
  Example: LazyModalsExample
};
