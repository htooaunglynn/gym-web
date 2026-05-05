"use client";

import React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 max-w-sm">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
