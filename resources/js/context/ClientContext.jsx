import axiosInstance from "@/apis/axiosInstance";
import { CLIENT_QUERY_KEY, useGetClientProfile } from "@/apis/client/get.api";
import {
    clearClientAuthToken,
    getClientToken,
    setClientAuthToken,
} from "@/apis/auth/client.api";
import { useQueryClient } from "@tanstack/react-query";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export const ClientContext = createContext(null);

export function ClientProvider({ children }) {
    const queryClient = useQueryClient();
    const [client, setClient] = useState(null);
    const [hasClientToken, setHasClientToken] = useState(Boolean(getClientToken()));

    const {
        data: profileClient,
        isFetching,
        isLoading,
        error,
        refetch,
    } = useGetClientProfile(hasClientToken);

    const clearSession = useCallback(() => {
        clearClientAuthToken();
        setHasClientToken(false);
        setClient(null);
        queryClient.setQueryData(CLIENT_QUERY_KEY, null);
        queryClient.removeQueries({ queryKey: CLIENT_QUERY_KEY });
    }, [queryClient]);

    const setClientSession = useCallback(
        (authResult) => {
            const token = authResult?.token ?? authResult?.data?.token;
            const nextClient = authResult?.client ?? authResult?.data?.client ?? null;

            if (token) {
                setClientAuthToken(token, authResult?.remember ?? true);
                setHasClientToken(true);
            }

            if (nextClient) {
                setClient(nextClient);
                queryClient.setQueryData(CLIENT_QUERY_KEY, nextClient);
            }
        },
        [queryClient],
    );

    const logout = useCallback(async () => {
        try {
            if (getClientToken()) {
                await axiosInstance.post("/client/logout");
            }
        } catch (logoutError) {
            console.error("Logout failed:", logoutError);
        } finally {
            clearSession();
        }
    }, [clearSession]);

    useEffect(() => {
        if (!hasClientToken) {
            setClient(null);
            return;
        }

        if (profileClient) {
            setClient(profileClient);
        }
    }, [hasClientToken, profileClient]);

    useEffect(() => {
        if ([401, 403].includes(error?.response?.status)) {
            clearSession();
        }
    }, [clearSession, error]);

    const value = useMemo(
        () => ({
            client,
            setClient,
            setClientSession,
            clearSession,
            logout,
            isAuthenticated: Boolean(hasClientToken && client),
            isClientLoading: hasClientToken && !client && (isLoading || isFetching),
            refetchClient: refetch,
        }),
        [
            clearSession,
            client,
            hasClientToken,
            isFetching,
            isLoading,
            logout,
            refetch,
            setClientSession,
        ],
    );

    return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export const useClient = () => {
    const context = useContext(ClientContext);

    if (!context) {
        throw new Error("useClient must be used within a ClientProvider.");
    }

    return context;
};
