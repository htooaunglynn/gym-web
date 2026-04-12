import React from "react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import type { CrudPanelMode } from "@/hooks/useCrudPanelState";

interface CrudPageTemplateProps {
    title: string;
    description: string;
    addLabel: string;
    onAdd: () => void;
    filters?: React.ReactNode;
    isLoading: boolean;
    isError: boolean;
    errorTitle: string;
    errorMessage?: string;
    onRetry: () => void;
    loadingText: string;
    tableContent: React.ReactNode;
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    panelMode: CrudPanelMode;
    panelTitle?: string;
    panelDescription?: string;
    panelContent?: React.ReactNode;
}

export function CrudPageTemplate({
    title,
    description,
    addLabel,
    onAdd,
    filters,
    isLoading,
    isError,
    errorTitle,
    errorMessage,
    onRetry,
    loadingText,
    tableContent,
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    panelMode,
    panelTitle,
    panelDescription,
    panelContent,
}: CrudPageTemplateProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="display-lg text-on-surface">{title}</h1>
                    <p className="text-body-md text-on-surface-variant mt-1">{description}</p>
                </div>

                <Button onClick={onAdd}>{addLabel}</Button>
            </div>

            <Card variant="outlined" className="space-y-4">
                {filters}

                {isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text={loadingText} />
                    </div>
                ) : isError ? (
                    <ErrorState
                        title={errorTitle}
                        message={errorMessage}
                        onRetry={onRetry}
                    />
                ) : (
                    <>
                        {tableContent}

                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={onPageChange}
                        />
                    </>
                )}
            </Card>

            {panelMode && panelContent ? (
                <Card variant="elevated" className="space-y-4">
                    <div>
                        {panelTitle ? (
                            <h2 className="headline-sm text-on-surface">{panelTitle}</h2>
                        ) : null}
                        {panelDescription ? (
                            <p className="text-body-md text-on-surface-variant mt-1">{panelDescription}</p>
                        ) : null}
                    </div>

                    {panelContent}
                </Card>
            ) : null}
        </div>
    );
}
