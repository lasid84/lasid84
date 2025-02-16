const EXCHANGE_RATE_BATCH_CHANNEL_URL = "https://nttaaz00000009.webhook.office.com/webhookb2/050f10d9-818e-4f44-9ff9-48b17ae33122@d245a9b2-207b-44d9-a89d-8a679234928a/IncomingWebhook/3923be62e6a0454c92ce657704ea2ff3/fe95c2f2-4af5-4823-999c-baf32e28b648/V22sc185s0kMy_v_l_MH3aPTE_dWsEgDCWg303sFzcIaE1";
const INSERT_USFP_MILESTONE_CHANNEL_URL = "https://nttaaz00000009.webhook.office.com/webhookb2/050f10d9-818e-4f44-9ff9-48b17ae33122@d245a9b2-207b-44d9-a89d-8a679234928a/IncomingWebhook/d48614ce646d48d4b02476dbe99f6f03/fe95c2f2-4af5-4823-999c-baf32e28b648/V2NmlNWZNOL82Mz6ezWbxZWl0IUjZduhV3EJ-3LbTUq0s1";

const batchReportTemplate = {
    "type": "message",
    "attachments": [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.5",
                "msteams": {
                    "width": "Full"
                },
                "body": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": 40,
                                "spacing": "None",
                                "items": [
                                    {
                                        "type": "Table",
                                        "columns": [
                                            {
                                                "width": 1
                                            }
                                        ],
                                        "rows": [
                                            {
                                                "type": "TableRow",
                                                "cells": [
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "EXCHANGE RATE",
                                                                "wrap": true,
                                                                "horizontalAlignment": "Center",
                                                                "size": "Large"
                                                            }
                                                        ],
                                                        "style": "good"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "TableRow",
                                                "cells": [
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "시작 시간",
                                                                        "wrap": true,
                                                                        "size": "Medium",
                                                                        "color": "Attention",
                                                                        "weight": "Bolder"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "2024/12/24 00:00:00",
                                                                        "wrap": true,
                                                                        "size": "Small"
                                                                    }
                                                                ],
                                                                "spacing": "None"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "TableRow",
                                                "cells": [
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "Container",
                                                                        "items": [
                                                                            {
                                                                                "type": "TextBlock",
                                                                                "text": "종료 시간",
                                                                                "wrap": true,
                                                                                "weight": "Bolder",
                                                                                "color": "Good"
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "2024/12/24 00:00:00",
                                                                        "wrap": true,
                                                                        "spacing": "None",
                                                                        "size": "Small"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "TableRow",
                                                "cells": [
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "Container",
                                                                        "items": [
                                                                            {
                                                                                "type": "TextBlock",
                                                                                "text": "실행 결과",
                                                                                "wrap": true,
                                                                                "weight": "Bolder",
                                                                                "color": "Accent"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "☑️",
                                                                        "wrap": true,
                                                                        "horizontalAlignment": "Center"
                                                                    }
                                                                ],
                                                                "spacing": "None"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "TableRow",
                                                "cells": [
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "발생 에러",
                                                                        "wrap": true,
                                                                        "weight": "Bolder"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "type": "Container",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "test",
                                                                        "wrap": true
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": 65,
                                "items": [
                                    {
                                        "type": "Table",
                                        "columns": [
                                            {
                                                "width": 1
                                            },
                                            {
                                                "width": 1
                                            },
                                            {
                                                "width": 1
                                            },
                                            {
                                                "width": 1
                                            }
                                        ],
                                        "rows": [
                                            {
                                                "type": "TableRow",
                                                "cells": [
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "종료 시간",
                                                                "wrap": true,
                                                                "spacing": "None",
                                                                "horizontalAlignment": "Center"
                                                            }
                                                        ],
                                                        "style": "emphasis"
                                                    },
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "프로세스",
                                                                "wrap": true,
                                                                "spacing": "None",
                                                                "horizontalAlignment": "Center"
                                                            }
                                                        ],
                                                        "style": "emphasis"
                                                    },
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "성공 여부",
                                                                "wrap": true,
                                                                "horizontalAlignment": "Center",
                                                                "spacing": "None"
                                                            }
                                                        ],
                                                        "style": "emphasis"
                                                    },
                                                    {
                                                        "type": "TableCell",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "관련 정보",
                                                                "wrap": true,
                                                                "horizontalAlignment": "Center",
                                                                "spacing": "None"
                                                            }
                                                        ],
                                                        "style": "emphasis"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "spacing": "None"
                    }
                ]
            }
        }
    ]
};

const batchReportProcessObject = {
    "type": "TableRow",
    "cells": [
        {
            "type": "TableCell",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "New TextBlock",
                    "wrap": true,
                    "horizontalAlignment": "Center"
                }
            ],
            "horizontalAlignment": "Center",
            "verticalContentAlignment": "Center"
        },
        {
            "type": "TableCell",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "New TextBlock",
                    "wrap": true,
                    "horizontalAlignment": "Center"
                }
            ],
            "horizontalAlignment": "Center",
            "verticalContentAlignment": "Center"
        },
        {
            "type": "TableCell",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "New TextBlock",
                    "wrap": true,
                    "horizontalAlignment": "Center"
                }
            ],
            "horizontalAlignment": "Center",
            "verticalContentAlignment": "Center"
        },
        {
            "type": "TableCell",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "New TextBlock",
                    "wrap": true,
                    "horizontalAlignment": "Center"
                }
            ],
            "horizontalAlignment": "Center",
            "verticalContentAlignment": "Center"
        }
    ]  
}

module.exports = {
    EXCHANGE_RATE_BATCH_CHANNEL_URL,
    INSERT_USFP_MILESTONE_CHANNEL_URL,
    batchReportTemplate,
    batchReportProcessObject
}

